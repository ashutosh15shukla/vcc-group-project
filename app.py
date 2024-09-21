from flask import Flask, render_template, jsonify, request
import sqlite3
from maze_generator import generate_maze
import time

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('highscore.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_maze')
def get_maze():
    size = int(request.args.get('size', 32))
    maze = generate_maze(size, size)
    return jsonify(maze)

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.get_json()
    player_name = data['player_name']
    score = data['score']
    time_taken = data['time_taken']

    conn = get_db_connection()
    conn.execute('INSERT INTO high_scores (player_name, score, time_taken) VALUES (?, ?, ?)', 
                 (player_name, score, time_taken))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success'})

@app.route('/highscores')
def highscores():
    conn = get_db_connection()
    scores = conn.execute('SELECT player_name, score, time_taken FROM high_scores ORDER BY score DESC, time_taken ASC').fetchall()
    conn.close()
    return render_template('highscores.html', scores=scores)

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS high_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            time_taken INTEGER NOT NULL  -- Time taken in seconds
        )
    ''')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)