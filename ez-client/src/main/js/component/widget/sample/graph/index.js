import { connect } from "react-redux";
import Widget from "component/widget/base/Widget.jsx";
import HelloGraphWidget from "component/widget/sample/graph/HelloGraphWidget.jsx";

const mapStateToProps = (state, ownProps) => {
  return {
    ...Widget.mapCommonWidgetProps(state, ownProps)
  };
};

export default connect(mapStateToProps)(HelloGraphWidget);

