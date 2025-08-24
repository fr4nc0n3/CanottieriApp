from flask import jsonify

def is_admin(claims: dict):
    return "admin" in claims.get("accountTypes", [])

def permission_denied():
    return jsonify({"message": "Permission denied"}), 403

def bad_json():
    return jsonify({"message": "Bad or missing JSON"}), 400

def missing_parameter(param_name: str):
    return jsonify({"message": "Missing parameter: " + param_name}), 400
