# Antigravity Application Standards & Requirements Blueprint

This document defines the mandatory architectural and UI requirements for all new applications developed within the Antigravity ecosystem.

---

## 1. Core Window & Layout Standards
Every application must support resizable windows, explicit centering on launch, and responsive controls.

### Centered Window Logic
Do not let Windows decide where the application starts. Calculate and place the window in the center of the screen:
```python
def center_window(window, width, height):
    window.update_idletasks()
    screen_width = window.winfo_screenwidth()
    screen_height = window.winfo_screenheight()
    x = (screen_width // 2) - (width // 2)
    y = (screen_height // 2) - (height // 2)
    window.geometry(f"{width}x{height}+{x}+{y}")
```

### Resizability & Boundaries
- Always call `.minsize(min_width, min_height)` to prevent UI elements from collapsing.
- Configure grid rows/columns with weight (e.g., `.grid_rowconfigure(0, weight=1)`) to ensure the layout resizes beautifully.

---

## 2. Themes (Dark & Light Ability)
Apps must support a clean, modern aesthetic with easy toggling between Dark and Light modes.

- **Default Mode**: Default to Dark mode (using sleek slate/obsidian grays instead of stark black).
- **CustomTkinter Integration**: Use `ctk.set_appearance_mode(mode)` (e.g., `"Dark"` or `"Light"`).
- **Standard Tkinter Theme Helper**: If using vanilla Tkinter, define a unified theme dictionary for background (`bg`), foreground (`fg`), accent, and button colors, updating active widgets recursively on theme change.
- **Persistence**: Store the selected theme in `config/settings.json` (e.g. `"appearance_mode": "Dark"`).

---

## 3. Language & Localization (English & Chinese)
Multi-language support must be built-in from day one.

### JSON-Based Translation Framework
For simple desktop portability, store translation strings in a unified JSON structure (either within a dedicated folder `translations/` or a file `config/translations.json`):

**Example structure of `translations.json`**:
```json
{
  "en": {
    "title": "Application Core Manager",
    "settings": "Settings",
    "theme": "Theme",
    "language": "Language",
    "save": "Save Changes",
    "credits": "Credits",
    "close": "Close"
  },
  "zh": {
    "title": "应用核心管理器",
    "settings": "设置",
    "theme": "主题",
    "language": "语言",
    "save": "保存更改",
    "credits": "关于/制作群",
    "close": "关闭"
  }
}
```

### Python Translation Helper
```python
import json
import os

class Translator:
    def __init__(self, default_lang="en"):
        self.lang = default_lang
        self.translations = {}
        # Load translations from file or fallback to internal dictionary
        
    def translate(self, key):
        return self.translations.get(self.lang, {}).get(key, key)
```

- **Runtime Switch**: Changing the language in the Settings panel should save the selected value to `config/settings.json` (e.g. `"language": "zh"`) and trigger an update of all UI widget labels dynamically.

---

## 4. Settings Popup & Configurations
Every app must have a Settings popup accessible via a menu or gear icon:
- Configures: Theme (Light/Dark/System), Language (English/Chinese).
- Saves to and loads from `config/settings.json`.
- Implements validation so corrupted config files fall back to system defaults.

---

## 5. Credits, Version Tracker, & Easter Eggs
A structured, personal signature must be embedded in all apps.

- **Version Tracker**: Read from a global `APP_REVISION = "1.000"` variable inside the main file. Display it on the status bar or the main window.
- **Credits Popup**: Dedicated modal listing developers and personal attribution:
  `"Created by Danny Y — Dedicated to wife Betty Y"`
- **Easter Eggs (8-Click Sequence)**:
  - **Trigger**: Click 8 consecutive times on the Credits title, logo, or version string.
  - **Easter Egg Action**:
    1. Show the dedicated message: `"Created by Danny Y — Dedicated to wife Betty Y"`.
    2. Activate the secret **Aria Theme** (obsidian purple `#2c001e` or Aaron Tribute dark theme).
    3. Typing `/aria` anywhere on the keyboard triggers this theme switch automatically.
  - **Hidden Developer Console**: On the 8th click of the Credits button, additionally reveal a hidden developer CLI text entry panel for executing raw system-level diagnostics or script runs.

---

## 6. Tkinter Safety Guidelines (Non-negotiable)
- **Always pass parents**: Always use `parent=self` in all `messagebox` and `filedialog` calls.
- **Topmost Avoidance**: **Never** call `self.attributes('-topmost', True)`. It causes major window freezes or blank fields on Windows.
- **Focus Restoration**: Always call `self.lift()` followed by `self.focus_force()` immediately after a file dialog closes.
- **UX Pickers**: Use `filedialog.askdirectory()` for directories, and `filedialog.askopenfilename()` for files. Never mix their purposes.

---

## 7. Setup & Execution Rules
- **Version Incrementing**: Never auto-increment the version. Wait for explicit instruction to upgrade `APP_REVISION`.
- **Executable Compilation**: Compile the script into a standalone `.exe` using PyInstaller:
  `python -m PyInstaller --onefile --windowed --name AppName --distpath "." AppName.py`
  *(The `.exe` must land in the project root, not in `dist/`)*.

---

## 8. Real-Time Session Audit Log Engine
Every app must initialize a millisecond-precision, immediately-flushed logging engine called `SessionLogger` on startup. This generates one log file per run under `results/session_logs/audit_YYYY-MM-DD_HH-MM-SS.log` for debugging and QA audit analysis.

### Standard SessionLogger Python Scaffolding:
```python
import os
import sys
import platform
import inspect
from datetime import datetime

RESULTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results")
SESSION_LOG_DIR = os.path.join(RESULTS_DIR, "session_logs")

class SessionLogger:
    EVENT_SUCCESS = "SUCCESS"
    EVENT_FAILURE = "FAILURE"
    EVENT_INFO    = "INFO"
    EVENT_WARN    = "WARNING"
    EVENT_STATE   = "STATE_CHANGE"
    EVENT_IO      = "FILE_IO"
    EVENT_UI      = "UI_EVENT"

    def __init__(self):
        self.session_start = datetime.now()
        os.makedirs(SESSION_LOG_DIR, exist_ok=True)
        fname = self.session_start.strftime("audit_%Y-%m-%d_%H-%M-%S.log")
        self.log_path = os.path.join(SESSION_LOG_DIR, fname)
        # buffering=1 enables line buffering so logs flush automatically
        self._fh = open(self.log_path, "a", encoding="utf-8", buffering=1)
        self._write_header()

    def _ts(self):
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

    def _write_header(self):
        sep = "=" * 100
        header = [
            sep,
            "  Application Session Audit Log",
            f"  Session Start : {self.session_start.strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}",
            f"  Host          : {platform.node()}",
            f"  OS            : {platform.system()} {platform.version()}",
            f"  Python        : {sys.version.split()[0]}",
            f"  PID           : {os.getpid()}",
            sep,
            "  COLUMN GUIDE: [Timestamp] | [Location::Function] | [EVENT_TYPE] | Detail",
            sep,
            ""
        ]
        self._fh.write("\n".join(header) + "\n")

    def _write(self, location, event_type, detail):
        self._fh.write(f"[{self._ts()}] | [{location}] | [{event_type}] | {detail}\n")

    def _caller(self):
        try:
            frame = inspect.stack()[2]
            func = frame.function
            local_self = frame[0].f_locals.get("self", None)
            cls = type(local_self).__name__ if local_self else "Module"
            return f"{cls}::{func}"
        except:
            return "Unknown"

    def info(self, detail): self._write(self._caller(), self.EVENT_INFO, detail)
    def success(self, detail): self._write(self._caller(), self.EVENT_SUCCESS, detail)
    def failure(self, detail): self._write(self._caller(), self.EVENT_FAILURE, detail)
    def warn(self, detail): self._write(self._caller(), self.EVENT_WARN, detail)
    def state(self, detail): self._write(self._caller(), self.EVENT_STATE, detail)
    def file_io(self, detail): self._write(self._caller(), self.EVENT_IO, detail)
    def ui_event(self, detail): self._write(self._caller(), self.EVENT_UI, detail)

slog = SessionLogger()
```

All significant events, user inputs, errors, and system state transitions must call `slog.info()`, `slog.success()`, etc., so testing/programming agents can reconstruct execution paths precisely.
