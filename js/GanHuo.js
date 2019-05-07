import React from "react";
import { FlatList, Image, StyleSheet, TouchableHighlight } from "react-native";
import { get } from "./configs/HttpUtils";

const screenWidth = require("Dimensions").get("window").width;

class ListItem extends React.PureComponent {

  _onPress = () => {
    this.props.onItemClick(this.props.item);
  };

  render() {
    return (
      <TouchableHighlight
        style={styles.itemContainer}
        onPress={this._onPress}
        underlayColor={"rgba(255,255,255,0.5)"}>
        <Image
          source={{
            uri: this.props.item.url,
            cache: "only-if-cached"
          }}
          style={styles.itemImg}
          defaultSource={require("./img/default_img.png")}/>
      </TouchableHighlight>
    );
  }
}

let pageNo = 1;
const pageSize = 20;

export default class GanHuo extends React.PureComponent {

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

  loadData = (page = 1, isRefreshing = true) => {
    pageNo = page;
    this.setState({
      isRefreshing
    });
    get(`http://gank.io/api/data/福利/${pageSize}/${pageNo}`)
      .then(response => {
        // console.log(response);
        const data = pageNo === 1
          ? [...response.data]
          : [...this.state.data, ...response.data];
        console.log(data.length);
        this.loadState = response.data.length === pageSize ? 1 : 0;
        this.setState({
          data,
          isRefreshing: false
        });
      }, reason => {
        this.loadState = isRefreshing ? 0 : 1;
        this.setState({
          isRefreshing: false
        });
      });
  };

  loadMoreData = () => {
    if (this.loadState !== 1) {
      return;
    }
    this.loadState = 2;
    this.loadData(pageNo + 1, false);
  };

  _onItemClick = (item) => {
    this.props.navigation.navigate(
      "ImageView",
      {
        uri: item.url,
        title: item.desc
      });
  };

  _renderItem = ({ item }) => (<ListItem item={item} onItemClick={this._onItemClick}/>);

  _keyExtractor = (item, index) => item.url.concat(index);

  _getItemLayout = (data, index) => ({
    length: (screenWidth * 0.65 + 10),
    offset: (screenWidth * 0.65 + 10) * index,
    index
  });

  render() {
    return (
      <FlatList
        style={styles.flatList}
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        numColumns={2}
        getItemLayout={this._getItemLayout}
        refreshing={this.state.isRefreshing}
        onRefresh={this.loadData}
        onEndReachedThreshold={0.1}
        onEndReached={this.loadMoreData}
      />
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    marginLeft: 2.5,
    marginRight: 2.5
  },
  itemContainer: {
    flex: 1,
    padding: 2.5
  },
  itemImg: {
    flex: 1,
    width: (screenWidth - 5) / 2 - 5,
    height: screenWidth * 0.65
  }
});
