import numpy as np
from sklearn.linear_model import LinearRegression


def income_baseline(rider_id, income_history):

    if income_history is None or len(income_history) < 3:
        return {
            "expected_hourly": 120,
            "confidence": 0.3
        }

    X = np.arange(len(income_history)).reshape(-1, 1)
    y = np.array(income_history)

    model = LinearRegression()
    model.fit(X, y)

    prediction = model.predict([[len(income_history)]])[0]

    confidence = model.score(X, y)

    return {
        "expected_hourly": round(prediction, 2),
        "confidence": round(confidence, 2)
    }