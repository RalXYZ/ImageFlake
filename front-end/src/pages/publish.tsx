import * as React from 'react';
import { Component } from 'react';
import myEth from '../scripts/myEth';
import Navbar from '../components/navbar';

class Publish extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    myEth.publish(this.state.value);
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div className="p-10 card bg-base-200">
          <div className="form-control">
            <form onSubmit={this.handleSubmit}>
              <label className="label">
                <span className="label-text">Hash</span>
              </label>
              <input type="text" placeholder="hash" value={this.state.value} onChange={this.handleChange}className="input"/>
              <button className="btn btn-primary" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Publish;
