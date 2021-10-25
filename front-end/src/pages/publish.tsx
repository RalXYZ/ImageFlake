import * as React from 'react';
import { Component } from 'react';
import { create } from 'ipfs-http-client';
import myEth from '../scripts/myEth';
import Navbar from '../components/navbar';
import ethConfig from '../../config/eth.yaml';

class Publish extends Component<{}, {value: File}> {
  constructor(props) {
    super(props);
    this.state = {value: null};

    this.onImageChange = this.onImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      await this.setState({
        value: e.target.files[0]
      });
      console.log(this.state.value);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const projectId = ethConfig.infura.projectId;
    const projectSecret = ethConfig.infura.projectSecret;
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth
      }
    });
    console.log(client);
    console.log(this.state.value);
    const added = await client.add(this.state.value, {
      progress: (prog) => console.log(`received: ${prog}`)
    });
    console.log(added);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(url);
    myEth.publish(added.path);
  }

  render() {

    return (
      <div>
        <Navbar/>
        <div className="p-10 card bg-base-200">
          <div className="form-control">
            <form onSubmit={this.handleSubmit}>
              <label className="label">
                <span className="label-text">Artwork</span>
              </label>
              <input type="file" name="myImage" onChange={this.onImageChange} className="input"/>
              <button className="btn btn-primary" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Publish;
