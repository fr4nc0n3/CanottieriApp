from flask import Blueprint, jsonify, request
import traceback

from flask_app.app.query import (
    db_create_planning,
    db_delete_planning,
    db_get_month_plannings,
    db_get_planning_filled,
    db_update_planning,
    model_to_dict,
)
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import datetime
from .helpers import is_admin, missing_parameter, permission_denied

api_planning = Blueprint("planning", __name__)


# ----------- CRUD planning -------------
@api_planning.route("/plannings", methods=["GET"])
@jwt_required()
def get_plannings():
    identity = get_jwt_identity()
    claims = get_jwt()

    year = request.args.get("year", None)
    month = request.args.get("month", None)  # indice tra 0 e 11

    print("request.args: ", request.args)

    if year is None:
        return missing_parameter("year")

    if month is None:
        return missing_parameter("month")

    year = int(year)
    month = int(month)

    month = month + 1  # converto l' indice tra 1 e 12 per lib datetime

    # TODO dovrei fare funzioni/e per prendere startDate e endDate
    startDate = datetime.date(year, month, 1).isoformat()

    endDate = None
    if month == 12:
        endDate = datetime.date(year + 1, 1, 1).isoformat()
    else:
        endDate = datetime.date(year, month + 1, 1).isoformat()

    month_plannings = db_get_month_plannings(startDate, endDate)
    month_plannings_filled = [db_get_planning_filled(p) for p in month_plannings]

    return jsonify(month_plannings_filled)


@api_planning.route("/plannings", methods=["POST"])
@jwt_required()
def create_planning():
    identity = get_jwt_identity()
    claims = get_jwt()

    print(request.url)

    if not is_admin(claims):
        return permission_denied()

    data = request.get_json()
    date = data.get("date")
    description = data.get("description")
    planningType = data.get("planningType")
    isRace = planningType.get("isRace")
    isTraining = planningType.get("isTraining")
    trainingIntensityPerc = planningType.get("trainingIntensityPerc")

    print("json: ", data)

    if not date or not description:
        return jsonify({"error": "date and description are required"}), 400

    if trainingIntensityPerc and (
        trainingIntensityPerc < 0 or trainingIntensityPerc > 100
    ):
        return jsonify({"error": "training intensity percentage is not valid"})

    try:
        date_ = datetime.date.fromisoformat(date)
        new_id = db_create_planning(
            date_,
            description,
            is_race=isRace,
            is_training=isTraining,
            training_intensity_perc=trainingIntensityPerc,
        )

        return jsonify({"id": new_id}), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400


@api_planning.route("/plannings/<int:planning_id>", methods=["PUT"])
@jwt_required()
def update_planning(planning_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    data = request.get_json()
    description = data.get("description")
    type_ = data.get("type")
    isRace = type_.get("isRace")
    isTraining = type_.get("isTraining")
    trainingIntensityPerc = type_.get("trainingIntensityPerc")

    if not description:
        return jsonify({"error": "date and description are required"}), 400

    db_update_planning(
        planning_id,
        description,
        is_race=isRace,
        is_training=isTraining,
        training_intensity_perc=trainingIntensityPerc,
    )

    return jsonify({"message": "Updated successfully"})


@api_planning.route("/plannings/<int:planning_id>", methods=["DELETE"])
@jwt_required()
def delete_planning(planning_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    db_delete_planning(planning_id)

    return jsonify({"status": "ok"})
