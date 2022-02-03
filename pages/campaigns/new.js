import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";

import { withRouter } from 'next/router'

import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";

class CampaignNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimunContribution: "",
      errorMessage: "",
      loading: false
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(event) {
    event.preventDefault();
    try {
      const { minimunContribution } = this.state;
      const {router} = this.props;
      this.setState({loading:true, errorMessage:""})
      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createCampaign(minimunContribution)
        .send({ from: accounts[0] });
      
      router.push('/');
    } catch (err) { 
      this.setState({ errorMessage: err.message });
    }
    this.setState({loading:false})
  }

  onInputChange = (event) => {
    this.setState({ minimunContribution: event.target.value });
  };

  render() {
    const { minimunContribution, errorMessage, loading} = this.state;
    return (
      <>
        <h3>Create a new campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!errorMessage}>
          <Form.Field>
            <label>Minimun contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              placeholder="Enter Minimum contribution..."
              value={minimunContribution}
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Message
            error
            header="Oops..!"
            content={errorMessage}
          />
          <Button primary loading={loading} type="submit">
            Create!
          </Button>
        </Form>
      </>
    );
  }
}

export default withRouter(CampaignNew);
