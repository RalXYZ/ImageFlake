import * as React from "react";
import { Component } from "react";
import { create } from "ipfs-http-client";
import myEth from "../scripts/myEth";
import Navbar from "../components/navbar";
import AlertOk from "../components/alert";
import ethConfig from "../../config/eth.yaml";

export interface AlertInterface {
  state: "error" | "success";
  hidden: boolean;
  message: string;
}

class Publish extends Component<
  {},
  {
    name: string;
    description: string;
    file: File;
    backgroundUrl: string;
    submitting: boolean;
    alert: AlertInterface;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      file: undefined,
      backgroundUrl:
        "https://images.pexels.com/photos/158571/architecture-about-building-modern-158571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      submitting: false,
      alert: {
        state: "error",
        hidden: true,
        message: "",
      },
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      await this.setState({
        file: e.target.files[0],
      });
      console.log(this.state.file);
      let fileReader = new FileReader();
      fileReader.onload = () => {
        this.setState({ backgroundUrl: fileReader.result as string });
      };
      fileReader.readAsDataURL(this.state.file);
    }
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitting: true });
    const projectId = ethConfig.infura.projectId;
    const projectSecret = ethConfig.infura.projectSecret;
    const auth =
      "Basic " +
      Buffer.from(projectId + ":" + projectSecret).toString("base64");
    const client = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });
    console.log(client);
    console.log(this.state.file);
    console.log(this.state.name);
    console.log(this.state.description);
    const added = await client.add(this.state.file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    console.log(added);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(url);
    try {
      await myEth.publish(added.path, this.state.name, this.state.description);
      this.setState({
        alert: {
          state: "success",
          hidden: false,
          message: "Publish success",
        },
      });
    } catch (err) {
      console.log(err);
      this.setState({
        alert: {
          state: "error",
          hidden: false,
          message: err.message,
        },
      });
    } finally {
      this.setState({ submitting: false });
    }
  }

  render() {
    return (
      <div>
        <Navbar currentTab="publish" />
        <div className="grid grid-cols-1 md:grid-cols-11 items-center p-4 card lg:card-side bordered bg-neutral">
          <div className="md:col-start-1 md:col-end-7 flex items-center">
            <img
              className="rounded-2xl max-h-96 justify-self-center"
              src={this.state.backgroundUrl}
            />
          </div>
          <div className="md:col-start-8 md:col-end-11 max-w-lg">
            <div className="form-control">
              <form onSubmit={this.handleSubmit}>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="name"
                  className="input input-bordered"
                  value={this.state.name}
                  onChange={this.handleNameChange}
                />

                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <input
                  type="text"
                  placeholder="description"
                  className="input input-bordered"
                  value={this.state.description}
                  onChange={this.handleDescriptionChange}
                />

                <label className="label">
                  <span className="label-text">Artwork</span>
                </label>
                <label
                  className={`btn btn-outline ${
                    this.state.file === undefined ? "" : "btn-accent"
                  }`}
                >
                  <span>
                    {this.state.file === undefined
                      ? "Select a file"
                      : this.state.file.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 ml-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                  <input
                    type="file"
                    name="myImage"
                    onChange={this.onImageChange}
                    className="hidden"
                  />
                </label>

                <button
                  className={`btn btn-primary btn-lg block my-4 ${
                    this.state.submitting ? "loading" : ""
                  }`}
                  type="submit"
                >
                  Submit Artwork
                </button>
              </form>
            </div>
          </div>
        </div>

        <AlertOk alert={this.state.alert} />
      </div>
    );
  }
}

export default Publish;
