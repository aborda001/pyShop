from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
	return "<p>Hello world!!</p>"

if __name__ == '__main__':
	app.run(port=5000,host="127.0.0.1",debug=True)