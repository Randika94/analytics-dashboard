# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from flask import render_template, redirect, request, url_for
from flask_login import (
    logout_user
)
from apps.authentication import blueprint

@blueprint.route('/')
def route_default():
    return redirect(url_for('authentication_blueprint.login'))


# Login & Registration
@blueprint.route('/sign-in')
def signIn():
    return render_template('home/accounts/login.html', segment='signIn')

@blueprint.route('/login', methods=['GET', 'POST'])
def login():
    return redirect(url_for('home_blueprint.index'))


@blueprint.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('authentication_blueprint.login'))


# Errors

@blueprint.errorhandler(403)
def access_forbidden(error):
    return render_template('home/errors/page-403.html'), 403


@blueprint.errorhandler(404)
def not_found_error(error):
    return render_template('home/errors/page-404.html'), 404


@blueprint.errorhandler(500)
def internal_error(error):
    return render_template('home/errors/page-500.html'), 500
