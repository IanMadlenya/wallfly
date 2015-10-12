var React = require('react');
var Api = require('../utils/Api.js');
var MuiContextified = require('./MuiContextified.jsx');
var mui = require('material-ui');
var Radium = require('radium');
var RepairRequestAddImage = require('./RepairRequestAddImage.jsx');

var RepairRequestImages = React.createClass({
  getInitialState() {
    return {
      repairRequestImages: [], // list of repair requests
    };
  },

  propTypes: {
    requestId: React.PropTypes.number,
  },

  getRepairRequestImages() {
    Api.getRepairRequestImages({
      data: {
        requestId: this.props.requestId,
      },
      callback: (err, response) => {
        if (err) {
          // TODO
          return console.log(err);
        }

        this.setState({
          repairRequestImages: response.data
        });
      }
    });
  },

  componentWillMount() {
    this.getRepairRequestImages()
  },

  render() {
    var { repairRequestImages } = this.state;
    var rows = repairRequestImages.map(request => {
      return (
        <tr key={request.id}>
          <td>
            {request.photo ?
              ( <img style={style.img} src={request.photo} /> ) :
              ( <i>No image added</i> )}
          </td>
          <div> {request.id}</div>
        </tr>
      );
    });

    return (
      <div style={style.page}>
        <table style={style.table}>
          {rows}
        </table>
        <div>
          <RepairRequestAddImage 
          repairRequestImageAdded= {this.getRepairRequestImages}
          requestId={this.props.requestId} 
          />
        </div>
      </div>
    );
  }
});

var style = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  table: {
    marginBottom: '10px'
  },
  img: {
    maxWidth: 200,
    borderRadius: 4,
  },
};

module.exports = Radium(MuiContextified(RepairRequestImages));
