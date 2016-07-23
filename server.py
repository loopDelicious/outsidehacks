"""Outside Hacks."""

from flask import Flask, render_template, Response, request
from jinja2 import StrictUndefined
import os
import json

app = Flask(__name__)

app.jinja_env.undefined = StrictUndefined

@app.route('/')
def index():
    """Homepage."""

    return render_template('homepage.html')


@app.route("/error")
def error():
    raise Exception("Error!")

if __name__ == "__main__":

    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = "NO_DEBUG" not in os.environ
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG)