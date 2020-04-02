import React, {Component} from 'react';
import {Text} from 'react-native';

export default class CustomText extends Component {

  render() {
    let {children, style = {}, ...attributes} = this.props;
    return (
      <Text style={[{fontSize: 18}, style]} {...attributes}>{children}</Text>
    );
  }
}
