from flask import Blueprint, jsonify, request
from ..db import (query_db, execute_ops_db, get_db)
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)
import datetime
from .helpers import (is_admin, missing_parameter, permission_denied)

api_planning = Blueprint("planning", __name__)

# -- TODO bisogna fare una route per prendere l' allenamento di un singolo giorno 
# o del giorno corrente
# Promem: TESTARE GLI ALTRI
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

    #TODO mettere in file .db
    month_plannings = query_db(
        "SELECT * FROM Planning WHERE date >= ? AND date < ?",
        tuple([startDate, endDate])
    )

    return jsonify([dict(p) for p in month_plannings])

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

    conn = None
    try:
        # TODO penso che le altre chiamate al db siano un po' limitate
        conn = get_db()
        cursor = conn.execute(
            'INSERT INTO Planning (date, description) VALUES (?, ?)',
            tuple([date, description])
        )
        conn.commit()
        new_id = cursor.lastrowid

        return jsonify({'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        if conn:
            conn.close()

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

    #TODO fare query in .db
    execute_ops_db([{
        'query': 'UPDATE Planning SET description = ? WHERE id = ?',
        'args': tuple([description, planning_id])
        }]
    )

    return jsonify({'message': 'Updated successfully'})

@api_planning.route('/plannings/<int:planning_id>', methods=['DELETE'])
@jwt_required()
def delete_planning(planning_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    # TODO fare funzione query in db.py
    execute_ops_db([{
        'query': 'DELETE FROM Planning WHERE id = ?', 'args': tuple([planning_id])
    }])

    return jsonify({'status': 'ok'})