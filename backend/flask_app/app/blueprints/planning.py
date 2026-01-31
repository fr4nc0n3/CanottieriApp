from flask import Blueprint, jsonify, request
import traceback

from backend.flask_app.app.query import create_planning_, delete_planning_, get_month_plannings_, update_planning_
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)
import datetime
from .helpers import (is_admin, missing_parameter, permission_denied)

api_planning = Blueprint("planning", __name__)

# ----------- CRUD planning -------------
@api_planning.route('/plannings', methods=['GET'])
@jwt_required()
def get_plannings():
    identity = get_jwt_identity()
    claims = get_jwt()

    year = request.args.get('year', None)
    month = request.args.get('month', None) # indice tra 0 e 11

    print("request.args: ", request.args)

    if year is None:
        return missing_parameter('year')
    
    if month is None:
        return missing_parameter('month')

    year = int(year)
    month = int(month)

    month = month + 1 # converto l' indice tra 1 e 12 per lib datetime 

    #TODO dovrei fare funzioni/e per prendere startDate e endDate
    startDate = datetime.date(year, month, 1).isoformat()

    endDate = None
    if(month == 12):
        endDate = datetime.date(year + 1, 1, 1).isoformat()
    else:
        endDate = datetime.date(year, month + 1, 1).isoformat()

    month_plannings = get_month_plannings_(startDate, endDate)

    return jsonify(month_plannings)

@api_planning.route('/plannings', methods=['POST'])
@jwt_required()
def create_planning():
    identity = get_jwt_identity()
    claims = get_jwt()

    print(request.url)

    if not is_admin(claims):
        return permission_denied()

    data = request.get_json()
    date = data.get('date')
    description = data.get('description')

    print("json: ", data)

    if not date or not description:
        return jsonify({'error': 'date and description are required'}), 400

    try:
        date_ = datetime.date.fromisoformat(date)
        new_id = create_planning_(date_, description)

        return jsonify({'id': new_id}), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

@api_planning.route('/plannings/<int:planning_id>', methods=['PUT'])
@jwt_required()
def update_planning(planning_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    data = request.get_json()
    description = data.get('description')

    if not description:
        return jsonify({'error': 'date and description are required'}), 400

    update_planning_(planning_id, description)

    return jsonify({'message': 'Updated successfully'})

@api_planning.route('/plannings/<int:planning_id>', methods=['DELETE'])
@jwt_required()
def delete_planning(planning_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    delete_planning_(planning_id)

    return jsonify({'status': 'ok'})