var React = require('react');
var Radium = require('radium');
var MuiContextified = require('./MuiContextified.jsx');
var mui = require('material-ui');
var Dialog = mui.Dialog;
var Label = require('./Label.jsx');

/**
 * Event Item
 * This is a event item that is located in an event List.
 */
var EventItem = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  /**
   * Shows the event dialog.
   */
  showEventDialog() {
    this.refs.dialog.show();
  },

  render() {
    var event = this.props.data;
    let standardActions = [
      { text: 'Close' }
    ];

    return (
      <div>
        <div
          onClick={this.showEventDialog}
          style={style.eventItem}>
          <strong>{event.date.format('h:mma')}</strong>&nbsp;
          {event.event}
        </div>
        <Dialog
          title={event.event}
          actions={standardActions}
          ref='dialog'>
          <Label>Date</Label>
          {event.date.format('DD/MM/YYYY — hh:mm A')}
          <Label>Notes</Label>
          { event.notes
            ? event.notes
            : <span style={style.noNotes}>No notes added.</span>
          }
        </Dialog>
      </div>
    );
  },
});

var style = {
  eventItem: {
    textAlign: 'left',
    fontSize: '0.7em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    ':hover': {
      background: '#efefef',
    }
  },
  noNotes: {
    color: '#ccc',
    fontStyle: 'italic',
  }
};

module.exports = MuiContextified(Radium(EventItem));
