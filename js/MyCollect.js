import React from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from "react-native";
import { get } from "./configs/HttpUtils";

class ListItem extends React.PureComponent {

  _renderItem = (item) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTopText}>{item.chapterName}</Text>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <View style={styles.itemBottomView}>
        <Text
          style={styles.itemBottomDate}>{`${item.niceDate} · ${item.author}`}</Text>
      </View>
    </View>
  );

  _onClick = () => {
    this.props.onItemClick(this.props.item);
  };

  render() {
    const item = this.props.item;
    if (Platform.OS === "android") {
      return (
        <TouchableNativeFeedback
          onPress={this._onClick}
          background={TouchableNativeFeedback.SelectableBackground()}>
          {this._renderItem(item)}
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableHighlight
        onPress={this._onClick}
        underlayColor={"rgba(223,223,223,0.5)"}>
        {this._renderItem(item)}
      </TouchableHighlight>
    );
  }
}

let pageNo = 1;

export default class MyCollect extends React.Component {

  static navigationOptions = {
    title: "我的收藏"
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isRefreshing: false
    };
    this.loadState = 0; // 是否加载数据的状态，0：没有更多数据可加载，1：可加载更多，2：正在加载中
  }

  componentDidMount() {
    this.loadData();
  }

  _onItemClick = (item) => {
    this.props.navigation.navigate(
      "Details",
      {
        uri: item.link,
        title: item.title
      });
  };

  _renderItem = ({ item }) => (<ListItem item={item} onItemClick={this._onItemClick}/>);

  _itemSeparatorComponent = () => (<View style={styles.itemSeparator}/>);

  _keyExtractor = (item) => String(item.id);

  loadMoreData = () => {
    if (this.loadState !== 1) {
      return;
    }
    this.loadState = 2;
    this.loadData(pageNo + 1, false);
  };

  loadData = (page = 1, isRefreshing = true) => {
    pageNo = page;
    this.setState({
      isRefreshing
    });
    get(`https://www.wanandroid.com/lg/collect/list/${pageNo - 1}/json`)
      .then((response) => {
        console.log(response);
        const data = pageNo === 1
          ? response.data.datas
          : this.state.data.concat(response.data.datas);
        console.log(data.length);
        this.loadState = response.data.over ? 0 : 1;
        this.setState({
          data,
          isRefreshing: false
        });
      }, () => {
        this.loadState = isRefreshing ? 0 : 1;
        this.setState({
          isRefreshing: false
        });
      });
  };

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._itemSeparatorComponent}
        keyExtractor={this._keyExtractor}
        extraData={this.state}
        refreshing={this.state.isRefreshing}
        onRefresh={this.loadData}
        onEndReachedThreshold={0.1}
        onEndReached={this.loadMoreData}
      />
    );
  }
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  itemSeparator: {
    height: 0.5,
    backgroundColor: "#d2d2d2"
  },
  itemContainer: {
    flex: 1,
    padding: 10
  },
  itemTopText: {
    color: "#9b9b9b",
    fontSize: 14
  },
  itemTitle: {
    color: "#333",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5
  },
  itemBottomView: {
    flex: 1,
    flexDirection: "row"
  },
  itemBottomDate: {
    color: "#9b9b9b",
    fontSize: 12
  },
  wrapper: {
    height: width * 0.42
  },
  slide: {
    flex: 1,
    justifyContent: "center"
  },
  image: {
    flex: 1
  },
  paginationStyle: {
    width: width,
    height: 30,
    top: width * 0.42 - 30,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)"
  }
});
