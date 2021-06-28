import React from 'react';
import {ThemeContext} from './theme-context';

class ThemedButton extends React.Component {
  render() {
    // let props = this.props;
    // let theme = this.context;
    return (
    //   <button
    //     {...props}
    //     style={{backgroundColor: theme.background, color: theme.foreground}}
    //   />
      <ThemeContext.Consumer>
        {({theme, toggleTheme}) => 
        (
            <button onClick={toggleTheme} style={{backgroundColor: theme.background, color: theme.foreground}}>
                Toggle Theme
            </button>
        )
        }
      </ThemeContext.Consumer>
    );
  }
}
// ThemedButton.contextType = ThemeContext;

export default ThemedButton;