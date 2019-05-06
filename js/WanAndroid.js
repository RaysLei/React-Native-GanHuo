import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Swiper from "react-native-swiper";

class ListItem extends React.PureComponent {

  _renderItem = (item) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTopView}>
        <Text style={styles.itemTopNewText}>{item.fresh ? "new!" : ""}</Text>
        <Text style={styles.itemTopRightText}>{item.chapterName}</Text>
      </View>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <View style={styles.itemBottomView}>
        <Text
          style={styles.itemBottomDate}>{`${item.niceDate} · ${item.author}`}</Text>
        <Icon name={"favorite"} size={28}
              color={item.collect ? "rgba(255,0,0,0.8)" : "#b7b7b7"}/>
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

export default class WanAndroid extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      bannerData: [],
      bannerIndex: 0,
      isRefreshing: false,
      loadState: 0 // 是否加载数据的状态，0：没有更多数据可加载，1：可加载更多，2：正在加载中
    };
  }

  componentDidMount() {
    this.getBanners();
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

  _keyExtractor = (item, index) => item.link.concat(index);

  loadMoreData = () => {
    if (this.state.loadState !== 1) {
      return;
    }
    this.setState({ loadState: 2 });
    this.loadData(pageNo + 1, false);
  };

  loadData = (page = 1, isRefreshing = true) => {
    pageNo = page;
    this.setState({
      isRefreshing
    });
    fetch(`https://www.wanandroid.com/article/list/${pageNo - 1}/json`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((response) => {
      // console.log(response);
      if (response.errorCode === 0) {
        const data = pageNo === 1
          ? response.data.datas
          : this.state.data.concat(response.data.datas);
        console.log(data.length);
        const loadState = response.data.over ? 0 : 1;
        this.setState({
          data,
          loadState,
          isRefreshing: false
        });
      }
    });
  };

  getBanners = () => {
    fetch("https://www.wanandroid.com/banner/json")
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(response => {
        if (response.errorCode === 0) {
          this.setState({ bannerData: response.data });
        }
      });
  };

  _onMomentumScrollEnd = (e, state) => {
    // console.log(state.index);
    this.setState({ bannerIndex: state.index });
  };

  _renderHeader = () => {
    if (this.state.bannerData.length === 0) {
      return (
        <View style={styles.wrapper}/>
      );
    }
    return (
      <View style={styles.wrapper}>
        <Swiper
          autoplay={true}
          showsPagination={false}
          onMomentumScrollEnd={this._onMomentumScrollEnd}>
          {
            this.state.bannerData.map((item) =>
              (
                <TouchableOpacity style={{ flex: 1 }} key={item.id} onPress={() => {
                  // console.log(this.props.navigation);
                  // console.log(this.props.navigation.dangerouslyGetParent);
                  // this.props.navigation.navigate("My");
                  this.props.navigation.navigate(
                    "Details",
                    {
                      uri: item.url,
                      title: item.title
                    });
                }}>
                  <Image style={styles.image} source={{ uri: item.imagePath }}/>
                </TouchableOpacity>
              )
            )
          }
        </Swiper>
        <View style={styles.paginationStyle}>
          <Text style={{ color: "white" }}>
            {this.state.bannerData[this.state.bannerIndex].title}
          </Text>
          <Text style={{ color: "white" }}>
            {this.state.bannerIndex + 1}/{this.state.bannerData.length}
          </Text>
        </View>
      </View>
    );
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
        ListHeaderComponent={this._renderHeader}
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
  itemTopView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemTopNewText: {
    color: "#CE3D3A",
    fontSize: 14,
    fontStyle: "italic"
  },
  itemTopRightText: {
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
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
