from flask import Flask, request, jsonify
from pricing_engine import calculate_pricing, get_zone_risk
from income_model import income_baseline

app = Flask(__name__)

@app.route('/api/pricing', methods=['POST'])
def pricing():
    data = request.json
    result = calculate_pricing(
        data.get('zone_id'),
        data.get('rider_income_weekly'),
        data.get('week_start')
    )
    return jsonify(result)

@app.route('/api/income_baseline', methods=['POST'])
def income():
    data = request.json
    result = income_baseline(
        data.get('rider_id'),
        data.get('income_history')
    )
    return jsonify(result)

@app.route('/api/zone_risk/<zone_id>', methods=['GET'])
def zone(zone_id):
    result = get_zone_risk(zone_id)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5002, debug=True)