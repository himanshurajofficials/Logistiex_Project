# Logistiex

## Error:

### 1. ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types
Sol: 
check if you have installed deprecated-react-native-prop-types package if not run the below command first.

`npm install deprecated-react-native-prop-types`

inside node_modules/react-native/index.js

replace these functions with the below lines

```
// Deprecated Prop Types
get ColorPropType(): $FlowFixMe {
  return require('deprecated-react-native-prop-types').ColorPropType;
},

get EdgeInsetsPropType(): $FlowFixMe {
  return require('deprecated-react-native-prop-types').EdgeInsetsPropType;
},

get PointPropType(): $FlowFixMe {
  return require('deprecated-react-native-prop-types').PointPropType;
},

get ViewPropTypes(): $FlowFixMe {
  return require('deprecated-react-native-prop-types').ViewPropTypes;
},
```
# Logistiex_Project
