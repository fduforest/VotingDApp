import React from "react"
import { Form, Field } from "simple-react-form"
import Text from "./fields/textField"

export default class SimpleForm extends React.Component {
  state = {}

  onSubmit({ address }) {}

  render() {
    return (
      <div>
        <Form ref="form" state={this.props.initialDoc} onSubmit={this.onSubmit}>
          <Field fieldName="address" label="Address" type={Text} />
        </Form>
        <button onClick={() => this.refs.form.submit()}>Submit</button>
      </div>
    )
  }
}
