from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
import os
import pandas as pd

app = Flask(__name__)
app.secret_key = 'kahraba_office_2026_secure'

def get_db():
    conn = sqlite3.connect('office_data.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    # إنشاء الجدول بالأعمدة الجديدة إذا لم يكن موجوداً أصلاً
    conn.execute('''CREATE TABLE IF NOT EXISTS property (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner TEXT, floor TEXT, bld TEXT, area TEXT, 
        zone TEXT, view TEXT, down TEXT, inst_val TEXT, inst_num TEXT)''')
    
    # تحديث الأعمدة لو قاعدة البيانات قديمة (لحل مشكلة image_85047e.jpg)
    cursor = conn.cursor()
    columns = [row[1] for row in cursor.execute("PRAGMA table_info(property)")]
    new_columns = ['zone', 'view', 'floor']
    for col in new_columns:
        if col not in columns:
            cursor.execute(f"ALTER TABLE property ADD COLUMN {col} TEXT")
    
    conn.commit()
    conn.close()

@app.route('/')
def index():
    search_query = request.args.get('search', '')
    conn = get_db()
    if search_query:
        # البحث في الأعمدة الأساسية
        query = "SELECT * FROM property WHERE owner LIKE ? OR bld LIKE ? OR zone LIKE ?"
        items = conn.execute(query, (f'%{search_query}%', f'%{search_query}%', f'%{search_query}%')).fetchall()
    else:
        items = conn.execute('SELECT * FROM property').fetchall()
    conn.close()
    return render_template('index.html', items=items)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form.get('username') == 'admin' and request.form.get('password') == '1234':
            session['logged_in'] = True
            return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/upload', methods=['POST'])
def upload_excel():
    if not session.get('logged_in'): return redirect(url_for('login'))
    file = request.files.get('excel_file')
    if file and file.filename.endswith(('.xlsx', '.xls')):
        try:
            df = pd.read_excel(file).fillna('')
            conn = get_db()
            for _, row in df.iterrows():
                conn.execute('''INSERT INTO property 
                    (owner, floor, bld, area, zone, view, down, inst_val, inst_num) 
                    VALUES (?,?,?,?,?,?,?,?,?)''', 
                    (str(row.get('المالك', '')), str(row.get('الدور', '')), str(row.get('المبنى', '')),
                     str(row.get('المساحة', '')), str(row.get('المنطقة', '')), str(row.get('الفيو', '')),
                     str(row.get('المقدم', '')), str(row.get('قيمة القسط', '')), str(row.get('عدد الأقساط', ''))))
            conn.commit()
            conn.close()
        except Exception as e: print(f"Excel Error: {e}")
    return redirect(url_for('index'))

@app.route('/add', methods=['POST'])
def add_property():
    if not session.get('logged_in'): return redirect(url_for('login'))
    conn = get_db()
    conn.execute('''INSERT INTO property 
        (owner, floor, bld, area, zone, view, down, inst_val, inst_num) 
        VALUES (?,?,?,?,?,?,?,?,?)''', 
        (request.form.get('owner'), request.form.get('floor'), request.form.get('bld'),
         request.form.get('area'), request.form.get('zone'), request.form.get('view'),
         request.form.get('down'), request.form.get('inst_val'), request.form.get('inst_num')))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/edit/<int:id>', methods=['POST'])
def edit(id):
    if not session.get('logged_in'): return redirect(url_for('login'))
    conn = get_db()
    conn.execute('''UPDATE property SET 
        owner=?, floor=?, bld=?, area=?, zone=?, view=?, 
        down=?, inst_val=?, inst_num=? WHERE id=?''', (
            request.form.get('owner'), request.form.get('floor'), request.form.get('bld'),
            request.form.get('area'), request.form.get('zone'), request.form.get('view'),
            request.form.get('down'), request.form.get('inst_val'), request.form.get('inst_num'), id
        ))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/delete/<int:id>')
def delete(id):
    if not session.get('logged_in'): return redirect(url_for('login'))
    conn = get_db()
    conn.execute('DELETE FROM property WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
