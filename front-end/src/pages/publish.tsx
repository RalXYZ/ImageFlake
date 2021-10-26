import * as React from 'react';
import { Component } from 'react';
import { create } from 'ipfs-http-client';
import myEth from '../scripts/myEth';
import Navbar from '../components/navbar';
import AlertOk from '../components/alert';
import ethConfig from '../../config/eth.yaml';

export interface AlertInterface {
  state: "error" | "success";
  hidden: boolean;
  message: string;
}

class Publish extends Component<{}, {file: File, submitting: boolean, alert: AlertInterface}> {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      submitting: false,
      alert: {
        state: "error",
        hidden: true,
        message: "",
      }
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      await this.setState({
        file: e.target.files[0],
      });
      console.log(this.state.file);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({submitting: true});
    const projectId = ethConfig.infura.projectId;
    const projectSecret = ethConfig.infura.projectSecret;
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      }
    });
    console.log(client);
    console.log(this.state.file);
    const added = await client.add(this.state.file, {
      progress: (prog) => console.log(`received: ${prog}`)
    });
    console.log(added);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(url);
    try { 
      await myEth.publish(added.path);
      this.setState({
        alert: {
          state: "success",
          hidden: false,
          message: "Publish success",
        }
      })
    } catch (err) {
      console.log(err);
      this.setState({
        alert: {
          state: "error",
          hidden: false,
          message: err.message,
        }
      })
    } finally {
      this.setState({submitting: false});
    }
    
  }

  render() {
    return (
      <div>
        <Navbar currentTab="publish"/>
        <div className="p-10 card bg-base-200">
          <div className="form-control">
            <form onSubmit={this.handleSubmit}>

              <label className="label">
                <span className="label-text">Name</span>
              </label> 
              <input type="text" placeholder="name" className="input"/>

              <label className="label">
                <span className="label-text">Description</span>
              </label> 
              <input type="text" placeholder="description" className="input"/>

              <label className="label">
                <span className="label-text">Artwork</span>
              </label>
              <label className={`btn btn-outline ${this.state.file === null ? "" : "btn-accent"}`}>
                <span>{this.state.file === null ? "Select a file" : this.state.file.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">  
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>                        
                </svg>
                <input type="file" name="myImage" onChange={this.onImageChange} className="hidden"/>
              </label>

              <button className={`btn btn-primary btn-lg block my-4 ${this.state.submitting ? "loading" : ""}`} type="submit">Submit Artwork</button>

            </form>
          </div>
        </div>
        <AlertOk alert={this.state.alert}/>
      </div>
    )
  }
}

export default Publish;
