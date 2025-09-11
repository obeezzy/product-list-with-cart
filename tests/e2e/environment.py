import subprocess
import time
import tempfile
from pathlib import Path
from selenium.webdriver.chrome.options import Options

# Path to your Brave executable

APP_DIR = Path(__file__).resolve().parent.parent.parent
FLASK_PORT = 8880


def get_brave_path():
    """Runs 'which brave' and returns the path if found, otherwise None."""
    try:
        process = subprocess.run(['which', 'brave'], capture_output=True, text=True, check=True)
        brave_path = process.stdout.strip()
        return brave_path
    except subprocess.CalledProcessError:
        return None
    except FileNotFoundError:
        return None


def get_chromium_path():
    """Runs 'which chromium' and returns the path if found, otherwise None."""
    try:
        process = subprocess.run(['which', 'chromium'], capture_output=True, text=True, check=True)
        chromium_path = process.stdout.strip()
        return chromium_path
    except subprocess.CalledProcessError:
        return None
    except FileNotFoundError:
        return None


def get_chrome_driver_path():
    """Runs 'which chromium' and returns the path if found, otherwise None."""
    try:
        process = subprocess.run(['which', 'chromedriver'], capture_output=True, text=True, check=True)
        chromium_path = process.stdout.strip()
        return chromium_path
    except subprocess.CalledProcessError:
        return None
    except FileNotFoundError:
        return None


def before_all(context):
    context.flask_process = subprocess.Popen(['python',
                                              "-m",
                                              "flask",
                                              "run",
                                              "--port",
                                              str(FLASK_PORT)],
                                             cwd=APP_DIR,
                                             stdout=subprocess.PIPE,
                                             stderr=subprocess.PIPE)
    context.base_url = f"http://localhost:{FLASK_PORT}/"
    brave_path = get_brave_path()
    chromium_path = get_chromium_path()
    if brave_path is not None:
        chrome_options = Options()
        chrome_options.binary_location = brave_path
        context.chrome_options = chrome_options
    elif chromium_path is not None:
        chrome_options = Options()
        chrome_options.binary_location = chromium_path
        chrome_options.add_argument(f"--user-data-dir={tempfile.mkdtemp()}")
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        context.chrome_options = chrome_options

    time.sleep(1)
    print(f"Flask server started at {context.base_url} in the background.")


def after_scenario(context, scenario):
    if hasattr(context, "driver"):
        if context.driver:
            context.driver.quit()
            print("Browser closed.")


def after_all(context):
    if hasattr(context, 'flask_process') and context.flask_process.poll() is None:
        context.flask_process.terminate()
        context.flask_process.wait(timeout=5)
        print("Flask server stopped.")
