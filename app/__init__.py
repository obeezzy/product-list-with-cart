from flask import Flask, render_template, url_for
import json
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent

app = Flask(__name__)

@app.route("/")
def index():
    with open(f"{CURRENT_DIR}/data.json") as f:
        data = json.load(f)

    data = format_data(data)
    return render_template("index.html", data=data)

def format_data(data):
    for item in data:
        item["image"]["desktop"] = url_for("static",
                                           filename=item["image"]["desktop"].replace("./", ""));
        item["image"]["tablet"] = url_for("static",
                                           filename=item["image"]["tablet"].replace("./", ""));
        item["image"]["mobile"] = url_for("static",
                                           filename=item["image"]["mobile"].replace("./", ""));
        item["image"]["thumbnail"] = url_for("static",
                                             filename=item["image"]["thumbnail"].replace("./", ""));
        price = item["price"]
        item["price"] = f"${price:.2f}";
    return data

if __name__ == '__main__':
    app.run(debug=True)
