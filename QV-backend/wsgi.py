from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/simulate/test', methods=['POST'])
def simulate_test():
    data = request.get_json()
    input_number = data.get('input_number')
    print(f'input_number:')
    if input_number != None:
        result = input_number * input_number
        return jsonify({'result': result})
    else:
        result = data
        return jsonify({'error': result})

if __name__ == 'main':
    app.run(debug=True)