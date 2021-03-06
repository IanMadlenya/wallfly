var React = require('react');
var User = require('../utils/User.js');
var Api = require('../utils/Api.js');
var mui = require('material-ui');
var TextField = mui.TextField;
var List = mui.List;
var ListItem = mui.ListItem;
var FontIcon = mui.FontIcon;
var Label = require('./Label.jsx');
var MuiContextified = require('./MuiContextified.jsx');
var ImageSelector = require('./ImageSelector.jsx');
var ErrorMessage = require('./ErrorMessage.jsx');
var Joi = require('joi');
var DialogEnhanced = require('./DialogEnhanced.jsx');
var JoiError = require('./JoiError.jsx');
var Radium = require('radium');

/*
 * UserProfile Component.
 * This component is a dialog window that shows the current user's profile
 * and also allows them to edit and update their profile details.
 */
var UserProfile = React.createClass({
  propTypes: {
    isOpen: React.PropTypes.bool.isRequired, // display the dialog?
  },

  getInitialState() {
    return {
      isEditing: false, // is the user editing their profile
      ...User.getUser(),
    };
  },

  /**
   * Put the profile into editing mode.
   */
  enableEdit() {
    this.setState({
      isEditing: true,
      updateError: false, // init error state
      validationError: undefined, // init error state
    });
  },

  /**
   * Cancels editing mode, returns profile to viewing mode.
   */
  cancelEdit() {
    this.setState({
      ...User.getUser(), // clear modified user state
      isEditing: false,
    });
  },

  /**
   * Validates the form; returns the Joi result of the validation.
   * @return {Object} Joi validation object.
   */
  validate() {
    return Joi.validate({
      username: this.state.username,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      email: this.state.email,
      avatar: this.state.avatar,
    }, schema);
  },

  /**
   * Persists the user profile updates on the server.
   */
  updateProfile() {
    var validation = this.validate();
    if (validation.error) {
      this.setState({ validationError: validation.error });
      return;
    }

    Api.updateUser({
      data: {
        username: this.state.username,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        email: this.state.email,
        avatar: this.state.avatar,
      },
      callback: (err, res) => {
        if (err) {
          this.setState({ updateError: true });
          return;
        }

        Api.getUser({
          callback: (err, response) => {
            User.setUser(response.data);
            this.setState({
              ...User.getUser(),  // ensure component state is in sync
              isEditing: false,
            });
          }
        });
      }
    });
  },

  /**
   * Event handler for capturing in the input field state on each keypress.
   * @param  {String} field The identifier for the input field.
   */
  onChange(field, event) {
    this.setState({ [field]: event.target.value });
  },

  /**
   * Image selected event handler
   * @param  {Object} payload JS File API payload of selected file.
   */
  onImageSelected(data) {
    this.setState({ avatar: data.dataURL });
  },

  render() {
    var { isOpen } = this.props;
    var { avatar, firstName, lastName, phone, email,
          isEditing, updateError, validationError } = this.state;

    // Server side error during profile update.
    var updateError = updateError ? (
      <ErrorMessage>Error during update. Please try again</ErrorMessage>
    ) : null;

    // Form validation error
    var validationError = (validationError) ? (
      <JoiError error={validationError} />
    ) : null;

    // List Icons
    var nameIcon = <FontIcon className="material-icons">person</FontIcon>;
    var emailIcon = <FontIcon className="material-icons">email</FontIcon>;
    var phoneIcon = <FontIcon className="material-icons">phone</FontIcon>;

    // Main content is dependent upon being in edit mode or not.
    var content = (!isEditing) ? (
      <div>
        <List>
          <div style={{textAlign: 'center'}}><img style={styles.img} src={avatar} /></div>
          <ListItem leftIcon={nameIcon} primaryText={`${firstName} ${lastName}`} />
          <ListItem leftIcon={emailIcon} primaryText={email} />
          <ListItem leftIcon={phoneIcon} primaryText={phone} />
        </List>
      </div>
    ) : (
      <div>
        {updateError}
        {validationError}
        <TextField value={firstName}
                   onChange={this.onChange.bind(this, 'firstName')}
                   floatingLabelText="First Name" />
        <TextField value={lastName}
                   onChange={this.onChange.bind(this, 'lastName')}
                   floatingLabelText="Last Name" />
        <TextField value={email}
                   onChange={this.onChange.bind(this, 'email')}
                   floatingLabelText="Email Address" />
        <TextField value={phone}
                   onChange={this.onChange.bind(this, 'phone')}
                   floatingLabelText="Phone" />
        <Label>Profile Picture</Label>
        <ImageSelector image={avatar}
                       onImageSelected={this.onImageSelected}
                       onImageSizeError={null} />
      </div>
    );

    // Dialog buttons are dependent on edit mode or not
    var actions;
    if (!isEditing) {
      actions = [
        { text: 'Close', onTouchTap: this.props.onClose },
        { text: 'Edit Profile', onTouchTap: this.enableEdit }
      ];
    } else {
      actions = [
        { text: 'Cancel', onTouchTap: this.cancelEdit },
        { text: 'Update Profile', onTouchTap: this.updateProfile }
      ];
    }

    return (
      <DialogEnhanced isOpen={isOpen}
                      modal={true}
                      actions={actions}
                      autoScrollBodyContent={true}
                      autoDetectWindowHeight={true}
                      contentStyle={{width: 300}}>
        {content}
      </DialogEnhanced>
    );
  }
});

/**
 * Joi validation schema for the form data.
 */
var schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30),
  firstName: Joi.string().alphanum().max(100),
  lastName: Joi.string().alphanum().max(100),
  phone: Joi.string().alphanum().min(8).max(10),
  email: Joi.string().email(),
  avatar: Joi.string(),
});

var styles = {
  img: {
    borderRadius: 4,
    maxWidth: 252,
  },
};

module.exports = Radium(MuiContextified(UserProfile));
