# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os
from apps.home import blueprint
from flask import Flask, flash, redirect, render_template, request, url_for, jsonify
from jinja2 import TemplateNotFound
from flask_wtf.csrf import CSRFProtect
from wtforms import Form, StringField, validators
from dotenv import load_dotenv
import requests

load_dotenv()
app = Flask(__name__)

API_URL = os.getenv('API_URL')

csrf = CSRFProtect(app)

class SearchCustomerForm(Form):
    member_id = StringField('Member ID', [
        validators.DataRequired(),
        validators.Length(min=1, max=30, message="Member is required")
    ])

class GetActiveUserRecForm(Form):
    mcc = StringField('MCC')   
    segment = StringField('Segment')   
    city = StringField('City') 
    is_create_campaign = StringField('Is Create Campaign') 
    campaign_name = StringField('Campaign Name')  
    campaign_description = StringField('Campaign Description')  

class GetInactiveUserRecForm(Form):
    segment = StringField('Segment')   
    start_date = StringField('Start Date') 
    end_date = StringField('End Date') 
    is_create_campaign = StringField('Is Create Campaign') 
    campaign_name = StringField('Campaign Name')  
    campaign_description = StringField('Campaign Description')      

@blueprint.route('/')
def index():
    try:
        response = requests.post(
            f'{API_URL}/get-dashboard-data/', 
            headers={'Content-Type': 'application/json'})

        if response.status_code == 200:
            api_data = response.json()
            return render_template('home/index.html', segment='index', dashboard=api_data['data'])
        else:
            return render_template('home/index.html', segment='index', dashboard=[])
    except Exception as e:
        return render_template('home/index.html', segment='index', dashboard=[])

@blueprint.route('/chart-data', methods=['GET'])
def getChartData():
    try:
        response = requests.post(
            f'{API_URL}/get-dashboard-data/', 
            headers={'Content-Type': 'application/json'}
        )
        if response.status_code == 200:
            api_data = response.json()
            chart_data = {
                "redemptionOptions": [
                    api_data['data']['chart_data']['Budget Spenders'],
                    api_data['data']['chart_data']['High Spenders'],
                    api_data['data']['chart_data']['Low Engagement'],
                    api_data['data']['chart_data']['Moderate Spenders']
                ]
            }
            return jsonify(chart_data)
        else:
            return jsonify({"redemptionOptions": [0, 0, 0]}), 400
    except Exception as e:
        print(f"Error fetching chart data: {e}")
        return jsonify({"redemptionOptions": [0, 0, 0]}), 500

@blueprint.route('/customer')
def customerManagement():

    return render_template('home/customer_management/index.html', segment='customerManagement')

@blueprint.route('/campaign')
def campaignManagement():
    try:
        response = requests.get(
            f'{API_URL}/get-campaign-details', 
            headers={'Content-Type': 'application/json'})
  
        if response.status_code == 200:
            api_data = response.json()
            return render_template('home/campaign_management/index.html', segment='campaignManagement', campaigns=api_data['campaign_data'])
        else:
            return render_template('home/campaign_management/index.html', segment='campaignManagement', campaigns=[])
    except Exception as e:
        return render_template('home/campaign_management/index.html', segment='campaignManagement', campaigns=[])
    
@blueprint.route('/active-users')
def activeUsersRecommendation():
    try:
        return render_template('home/recommendation/active_users.html', segment='getActiveUserRecommendation', activeUsers=[])
    except Exception as e:
        return render_template('home/recommendation/active_users.html', segment='getActiveUserRecommendation', activeUsers=[])
    
@blueprint.route('/get-active-users', methods=['POST'])
def getActiveUserRecommendation():

    form = GetActiveUserRecForm(request.form)

    if request.method == 'POST' and form.validate():
        mcc = form.mcc.data
        segment = form.segment.data
        city = form.city.data
        createCampaignBoolean = form.is_create_campaign.data
        campaign_name = form.campaign_name.data
        campaign_description = form.campaign_description.data
        if createCampaignBoolean == 'on':
            try:
                response = requests.post(
                    f'{API_URL}/filter', 
                    headers={'Content-Type': 'application/json'}, 
                    json={'mcc': mcc,'segment':segment,'city':city,'is_create_campaign':'1','campaign_name':campaign_name,'campaign_description':campaign_description}
                )
                if response.status_code == 200:
                    return redirect(url_for('home_blueprint.campaignManagement'))
                else:
                    return render_template('home/recommendation/active_users.html', segment='getActiveUserRecommendation', activeUsers=[])
            except Exception as e:
                return render_template('home/recommendation/active_users.html', segment='getActiveUserRecommendation', activeUsers=[])
        else:
            try:
                response = requests.post(
                    f'{API_URL}/filter', 
                    headers={'Content-Type': 'application/json'}, 
                    json={'mcc': mcc,'segment':segment,'city':city,'is_create_campaign':'0','campaign_name':campaign_name,'campaign_description':campaign_description}
                )
                if response.status_code == 200:
                     api_data=response.json()
                     return render_template('home/recommendation/active_users.html', segment='getActiveUserRecommendation', activeUsers=api_data['customer_data'])
                else:
                    return render_template('home/recommendation/active_users.html', segment='getActiveUserRecommendation', activeUsers=[])
            except Exception as e:
                return render_template('home/recommendation/active_users.html', segment='getActiveUserRecommendation', activeUsers=[])

@blueprint.route('/inactive-users')
def inactiveUsersRecommendation():
    try:
        return render_template('home/recommendation/inactive_users.html', segment='inactiveUsersRecommendation', InactiveUsers=[])
    except Exception as e:
        return render_template('home/recommendation/inactive_users.html', segment='inactiveUsersRecommendation', InactiveUsers=[])

@blueprint.route('/get-inactive-users', methods=['POST'])
def getInactiveUserRecommendation():

    form = GetInactiveUserRecForm(request.form)

    if request.method == 'POST' and form.validate():
        segment = form.segment.data
        start_date = form.start_date.data
        end_date = form.end_date.data
        createCampaignBoolean = form.is_create_campaign.data
        campaign_name = form.campaign_name.data
        campaign_description = form.campaign_description.data
        if createCampaignBoolean == 'on':
            try:
                response = requests.post(
                    f'{API_URL}/get-inactive-customers', 
                    headers={'Content-Type': 'application/json'}, 
                    json={'segment':segment,'start_date':start_date,'end_date':end_date,'is_create_campaign':'1','campaign_name':campaign_name,'campaign_description':campaign_description}
                )
                if response.status_code == 200:
                    return redirect(url_for('home_blueprint.campaignManagement'))
                else:
                    return render_template('home/recommendation/inactive_users.html', segment='getInactiveUserRecommendation', InactiveUsers=[])
            except Exception as e:
                return render_template('home/recommendation/inactive_users.html', segment='getInactiveUserRecommendation', InactiveUsers=[])
        else:
            try:
                response = requests.post(
                    f'{API_URL}/get-inactive-customers', 
                    headers={'Content-Type': 'application/json'}, 
                    json={'segment':segment,'start_date':start_date,'end_date':end_date,'is_create_campaign':'0','campaign_name':campaign_name,'campaign_description':campaign_description}
                )
               
                if response.status_code == 200:
                     api_data=response.json()
                     return render_template('home/recommendation/inactive_users.html', segment='getInactiveUserRecommendation', InactiveUsers=api_data['customer_data'])
                else:
                    return render_template('home/recommendation/inactive_users.html', segment='getInactiveUserRecommendation', InactiveUsers=[])
            except Exception as e:
                return render_template('home/recommendation/inactive_users.html', segment='getInactiveUserRecommendation', InactiveUsers=[])

@blueprint.route('/search-customer', methods=['GET', 'POST'])
def searchCustomer():
    form = SearchCustomerForm(request.form)
    if request.method == 'POST' and form.validate():
        memberId = form.member_id.data
        try:
            response = requests.post(
                f'{API_URL}/search-customer', 
                headers={'Content-Type': 'application/json'}, 
                json={'customer_id': memberId}
            )
            if response.status_code == 200:
                api_data = response.json()
                print(api_data['customer_data'])
                return render_template('home/customer_management/show.html', segment='searchCustomer', memberId=memberId, customerData=api_data['customer_data'])
            else:
                flash('Something went wrong!', 'error')
                return redirect(url_for('home_blueprint.customerManagement'))
        except Exception as e:
            flash(f'Something went wrong! {str(e)}', 'error')
            return redirect(url_for('home_blueprint.customerManagement'))
        
        
@blueprint.route('/<template>')
def route_template(template):

    try:

        if not template.endswith('.html'):
            template += '.html'

        # Detect the current page
        segment = get_segment(request)

        # Serve the file (if exists) from app/templates/home/FILE.html
        return render_template("home/" + template, segment=segment)

    except TemplateNotFound:
        return render_template('home/errors/page-404.html'), 404

    except:
        return render_template('home/errors/page-500.html'), 500


# Helper - Extract current page name from request
def get_segment(request):

    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment

    except:
        return None
