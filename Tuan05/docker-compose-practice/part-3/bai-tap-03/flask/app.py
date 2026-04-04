import os
from flask import Flask

app = Flask(__name__)
instance = os.getenv("INSTANCE", "flask")


@app.route("/")
def home():
    return f"Hello from {instance}"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
