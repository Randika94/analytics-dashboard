# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from flask import Flask, render_template, request, flash, redirect, url_for, session
from flask_login import (
    logout_user
)
from apps.authentication import blueprint
from flask_wtf.csrf import CSRFProtect
from wtforms import Form, StringField, PasswordField, validators

app = Flask(__name__)
csrf = CSRFProtect(app)

class LoginForm(Form):
    username = StringField('Username', [
        validators.DataRequired(),
        validators.Length(min=3, max=30, message="Username must be between 3 and 30 characters.")
    ])
    password = PasswordField('Password', [
        validators.DataRequired(),
        validators.Length(min=6, message="Password must be at least 6 characters.")
    ])


class RegisterForm(Form):
    username = StringField('Username', [
        validators.DataRequired(),
        validators.Length(min=3, max=30, message="Username must be between 3 and 30 characters.")
    ])

    email = StringField('email', [
        validators.DataRequired(),
    ])

    password = PasswordField('Password', [
        validators.DataRequired(),
        validators.Length(min=6, message="Password must be at least 6 characters.")
    ])

@blueprint.route('/')
def signIn():
    return render_template('accounts/login.html', segment='signIn')


@blueprint.route('/register', methods=['GET', 'POST'])
def register():
    return render_template('accounts/register.html', segment='register')

# Login & Registration
@blueprint.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)
    username = form.username.data
    session['username'] = username
    return redirect(url_for('home_blueprint.index'))


@blueprint.route('/register-user', methods=['GET', 'POST'])
def registerUser():
    form = RegisterForm(request.form)
    username = form.username.data
    session['username'] = username
    return redirect(url_for('home_blueprint.index'))


@blueprint.route('/logout')
def logout():
     return render_template('accounts/login.html', segment='logout')

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
