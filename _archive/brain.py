import sqlite3
import argparse
from datetime import datetime
import os
import sys
import re

DB_NAME = "project_brain.db"

def get_db_path():
    # Store the db dynamically based on execution context
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(sys.executable)
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, DB_NAME)

def init_db():
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    # Create logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            topic TEXT,
            content TEXT NOT NULL,
            user_email TEXT DEFAULT 'dannyinstall2023@gmail.com',
            folder TEXT DEFAULT '',
            hostname TEXT DEFAULT '',
            local_username TEXT DEFAULT '',
            UNIQUE(timestamp, topic)
        )
    ''')
    cursor.execute("PRAGMA table_info(logs)")
    columns = [col[1] for col in cursor.fetchall()]
    if "user_email" not in columns:
        cursor.execute("ALTER TABLE logs ADD COLUMN user_email TEXT DEFAULT 'dannyinstall2023@gmail.com'")
    if "folder" not in columns:
        cursor.execute("ALTER TABLE logs ADD COLUMN folder TEXT DEFAULT ''")
    if "hostname" not in columns:
        cursor.execute("ALTER TABLE logs ADD COLUMN hostname TEXT DEFAULT ''")
    if "local_username" not in columns:
        cursor.execute("ALTER TABLE logs ADD COLUMN local_username TEXT DEFAULT ''")
    # Create tasks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def log_entry(topic, content=None, file_path=None, user_email='dannyinstall2023@gmail.com'):
    if file_path and os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content_from_file = f.read()
        if content:
            content = content + "\n\n" + content_from_file
        else:
            content = content_from_file
            
    if not content:
        print("Error: Must provide content or a valid file.")
        return
        
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    folder = os.path.basename(os.path.dirname(get_db_path()))
    hostname = os.environ.get('COMPUTERNAME', 'Unknown')
    local_username = os.getlogin() if hasattr(os, 'getlogin') else 'Unknown'
    
    try:
        cursor.execute('''
            INSERT INTO logs (timestamp, topic, content, user_email, folder, hostname, local_username)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (timestamp, topic, content, user_email, folder, hostname, local_username))
        conn.commit()
    except sqlite3.IntegrityError:
        print(f"Skipping duplicate log: [{timestamp}] {topic}")
    conn.close()
    print(f"[{timestamp}] Successfully logged to project brain.")

def add_todo(description):
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        INSERT INTO tasks (timestamp, description, status)
        VALUES (?, ?, 'todo')
    ''', (timestamp, description))
    task_id = cursor.lastrowid
    conn.commit()
    conn.close()
    print(f"[{timestamp}] Added new task #{task_id}: {description}")

def mark_done(task_id):
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE tasks SET status = 'done' WHERE id = ?
    ''', (task_id,))
    
    if cursor.rowcount == 0:
        print(f"Error: Task #{task_id} not found.")
    else:
        print(f"Successfully marked task #{task_id} as complete.")
    conn.commit()
    conn.close()

def get_status(limit=5):
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    
    # 0. Fetch Multi-User Lifetime Tokens
    cursor.execute('''
        SELECT content FROM logs ORDER BY timestamp DESC LIMIT 150
    ''')
    log_contents = cursor.fetchall()
    
    danny_tokens = 0
    lili_tokens = 0
    d_found, l_found = False, False
    
    for row in log_contents:
        # Check Danny
        if not d_found:
            d_match = re.search(r'\[User:.*?danny.*?\].*?Lifetime Tokens Used:\s*([0-9,]+)', row[0], re.IGNORECASE | re.DOTALL)
            if d_match:
                danny_tokens = int(d_match.group(1).replace(',', ''))
                d_found = True
        
        # Check Lili
        if not l_found:
            l_match = re.search(r'\[User:.*?lili.*?\].*?Lifetime Tokens Used:\s*([0-9,]+)', row[0], re.IGNORECASE | re.DOTALL)
            if l_match:
                lili_tokens = int(l_match.group(1).replace(',', ''))
                l_found = True
                
        if d_found and l_found:
            break
            
    print(f"=== Token Tracking Dashboard ===")
    print(f"Lifetime Tokens (Danny): {danny_tokens:,} / 2,000,000 (Daily Cap)")
    print(f"Lifetime Tokens (Lili): {lili_tokens:,} / 2,000,000 (Daily Cap)")
    print("==============================\n")
    # 1. Fetch uncompleted tasks
    cursor.execute('''
        SELECT id, timestamp, description FROM tasks 
        WHERE status = 'todo' ORDER BY id ASC
    ''')
    tasks = cursor.fetchall()
    
    if tasks:
        print(f"=== Active Tasks ({len(tasks)}) ===")
        for task in tasks:
            print(f"[#{task[0]}] {task[2]}")
        print("")
    else:
        print("=== Active Tasks (0) ===")
        print("No pending tasks.\n")

    # 2. Fetch recent logs
    cursor.execute('''
        SELECT timestamp, topic, content FROM logs 
        ORDER BY timestamp DESC LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        print("=== Recent Logs ===")
        print("No logs found in the project brain.")
        return

    print(f"=== Recent Logs (Latest {len(rows)}) ===")
    for row in reversed(rows): # Print chronological order
        topic_str = f"Topic: {row[1]} | " if row[1] else ""
        print(f"[{row[0]}] {topic_str}{row[2]}\n")

def search_logs(keyword):
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    search_term = f"%{keyword}%"
    
    # Search Logs
    cursor.execute('''
        SELECT timestamp, topic, content FROM logs 
        WHERE content LIKE ? OR topic LIKE ?
        ORDER BY timestamp ASC
    ''', (search_term, search_term))
    log_rows = cursor.fetchall()

    # Search Tasks
    cursor.execute('''
        SELECT id, timestamp, description, status FROM tasks 
        WHERE description LIKE ?
        ORDER BY id ASC
    ''', (search_term,))
    task_rows = cursor.fetchall()

    conn.close()
    
    if not log_rows and not task_rows:
        print(f"No results found containing keyword: '{keyword}'")
        return

    if task_rows:
        print(f"--- Task Search Results for '{keyword}' ({len(task_rows)} found) ---")
        for t in task_rows:
            print(f"[#{t[0]}] ({t[3].upper()}) {t[2]}")
        print("")

    if log_rows:
        print(f"--- Log Search Results for '{keyword}' ({len(log_rows)} found) ---")
        for row in log_rows:
            topic_str = f"Topic: {row[1]} | " if row[1] else ""
            print(f"[{row[0]}] {topic_str}{row[2]}\n")

def search_by_date(date_str):
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    search_term = f"{date_str}%"
    cursor.execute('''
        SELECT timestamp, topic, content FROM logs 
        WHERE timestamp LIKE ?
        ORDER BY timestamp ASC
    ''', (search_term,))
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        print(f"No logs found on date: {date_str}")
        return

    print(f"--- Logs for Date {date_str} ({len(rows)} found) ---")
    for row in rows:
        topic_str = f"Topic: {row[1]} | " if row[1] else ""
        print(f"[{row[0]}] {topic_str}{row[2]}\n")

def export_logs(filename="exported_brain.md"):
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute('''
        SELECT timestamp, topic, content FROM logs 
        ORDER BY timestamp ASC
    ''')
    rows = cursor.fetchall()
    conn.close()

    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(sys.executable)
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))
    export_path = os.path.join(base_dir, filename)
    with open(export_path, 'w', encoding='utf-8') as f:
        f.write("# Project Brain Export\n\n")
        for row in rows:
            topic_str = f"User: [{row[1]}] | " if row[1] else ""
            f.write(f"[{row[0]}] {topic_str}{row[2]}\n\n")
    print(f"Successfully exported {len(rows)} logs to {filename}")

def import_gemini_logs(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by "## Conversation"
    conversations = re.split(r'(?=^## Conversation)', content, flags=re.MULTILINE)
    
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    
    added_count = 0
    skipped_exact = 0

    for conv in conversations:
        conv = conv.strip()
    # Pattern 1: High-level System Generated Logs (### USER Objective:)
    pattern_system = r'(?:Created:\s*(?P<date>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z).*?###\s*USER\s*Objective:.*?(?P<topic>.*?)\n\n(?P<content>.*?)(?=\n##\s*Conversation|\Z))'
    
    # Pattern 2: Verbatim Conversational Transcripts ([YYYY-MM-DD HH:MM:SS])
    pattern_transcript = r'\[(?P<date>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]\n(?P<content>.*?)(?=\n\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]|\Z)'

    added = 0
    skipped = 0

    # Process System Logs
    for match in re.finditer(pattern_system, content, re.IGNORECASE | re.DOTALL):
        timestamp_raw = match.group('date').strip()
        topic = match.group('topic').strip()
        text_content = match.group('content').strip()
        
        try:
            dt = datetime.strptime(timestamp_raw, "%Y-%m-%dT%H:%M:%SZ")
            formatted_time = dt.strftime("%Y-%m-%d %H:%M:%S")
        except:
            formatted_time = timestamp_raw
            
        cursor.execute("SELECT id, content FROM logs WHERE topic = ?", (topic,))
        existing_matches = cursor.fetchall()
        
        is_exact_duplicate = False
        for row_id, existing_content in existing_matches:
            if existing_content.strip() == text_content:
                is_exact_duplicate = True
                skipped += 1
                break
                
        if not is_exact_duplicate:
            cursor.execute("INSERT INTO logs (timestamp, topic, content, user_email) VALUES (?, ?, ?, ?)", (formatted_time, topic, text_content, 'dannyinstall2023@gmail.com'))
            added += 1

    # Process Transcript Logs
    for match in re.finditer(pattern_transcript, content, re.IGNORECASE | re.DOTALL):
        timestamp_raw = match.group('date').strip()
        text_content = match.group('content').strip()
        
        # Auto-format spacing if the user pastes a dense block
        text_content = re.sub(r'[\r\n]+(User:|AI:|Gemini:|Technical Logic:)', r'\n\n\1', text_content, flags=re.IGNORECASE)
        
        # Deduce a topic from the first line of the content
        first_line_match = re.search(r'User:\s*"(.*?)"', text_content, re.IGNORECASE)
        if first_line_match:
            topic = first_line_match.group(1)[:50] + "..." if len(first_line_match.group(1)) > 50 else first_line_match.group(1)
        else:
            topic = "Detailed Transcript"
            
        formatted_time = timestamp_raw  # Already in YYYY-MM-DD HH:MM:SS format
        
        cursor.execute("SELECT id, content FROM logs WHERE timestamp = ? AND topic = ?", (formatted_time, topic))
        if cursor.fetchone():
            skipped += 1
            continue
            
        cursor.execute("INSERT INTO logs (timestamp, topic, content, user_email) VALUES (?, ?, ?, ?)", (formatted_time, topic, text_content, 'dannyinstall2023@gmail.com'))
        added += 1

    conn.commit()
    conn.close()
    
    print(f"\nImport Complete! Added: {added} | Skipped Duplicates: {skipped}")


if __name__ == "__main__":
    init_db()

    parser = argparse.ArgumentParser(description="Local Project Brain - Command Line Interface")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # LOG Command
    log_parser = subparsers.add_parser("log", help="Add a new entry to the database")
    log_parser.add_argument("content", type=str, nargs='?', default=None, help="The content/action to log")
    log_parser.add_argument("-t", "--topic", type=str, help="Optional topic or user prompt summary", default="Agent Action")
    log_parser.add_argument("-f", "--file", type=str, help="Path to a text file containing the detailed log content", default=None)
    log_parser.add_argument("-e", "--email", type=str, help="User email for token tracking", default="dannyinstall2023@gmail.com")

    # TODO Command
    todo_parser = subparsers.add_parser("todo", help="Add a new uncompleted task")
    todo_parser.add_argument("description", type=str, help="Task description")

    # DONE Command
    done_parser = subparsers.add_parser("done", help="Mark a task as completed")
    done_parser.add_argument("id", type=int, help="ID of the task to mark as complete")

    # STATUS Command
    status_parser = subparsers.add_parser("status", help="Get active tasks and recent log entries")
    status_parser.add_argument("-n", "--number", type=int, help="Number of recent logs to retrieve (default: 5)", default=5)

    # SEARCH Command
    search_parser = subparsers.add_parser("search", help="Search logs and tasks for a keyword")
    search_parser.add_argument("keyword", type=str, help="Keyword to search for")

    # DATE Command
    date_parser = subparsers.add_parser("date", help="Get logs for a specific date")
    date_parser.add_argument("date", type=str, help="Date to search for in YYYY-MM-DD format (e.g., 2026-03-05)")

    # EXPORT Command
    export_parser = subparsers.add_parser("export", help="Export all logs to a text file")
    export_parser.add_argument("-f", "--filename", type=str, help="Optional filename to export to", default="exported_brain.md")

    # IMPORT Command
    import_parser = subparsers.add_parser("import", help="Import a raw Gemini Markdown log file")
    import_parser.add_argument("file", type=str, help="The path to the text file containing the Gemini log data")

    args = parser.parse_args()

    if args.command == "log":
        log_entry(args.topic, args.content, getattr(args, 'file', None), getattr(args, 'email', 'dannyinstall2023@gmail.com'))
    elif args.command == "todo":
        add_todo(args.description)
    elif args.command == "done":
        mark_done(args.id)
    elif args.command == "status":
        get_status(args.number)
    elif args.command == "search":
        search_logs(args.keyword)
    elif args.command == "date":
        search_by_date(args.date)
    elif args.command == "export":
        export_logs(args.filename)
    elif args.command == "import":
        import_gemini_logs(args.file)
    else:
        parser.print_help()
