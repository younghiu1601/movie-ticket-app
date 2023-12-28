import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import { baseImagePath, movieCastDetails, movieDetails, movieTrailer } from '../api/apicalls';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import AppHeader from '../components/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import CategoryHeader from '../components/CategoryHeader';
import CastCard from '../components/CastCard';
import AntDesign from 'react-native-vector-icons/AntDesign';
import YoutubePlayer from 'react-native-youtube-iframe';

const getMovieDetails = async (movieid: number) => {
  try {
    let response = await fetch(movieDetails(movieid));
    let json = await response.json();
    return json;
  } catch (error) {
    console.error('Something Went wrong in getMoviesDetails Function', error);
  }
};

const getMovieCastDetails = async (movieid: number) => {
  try {
    let response = await fetch(movieCastDetails(movieid));
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(
      'Something Went wrong in getMovieCastDetails Function',
      error,
    );
  }
};

const getMovieTrailer = async (movieid: number) => {
  try {
    let response = await fetch(movieTrailer(movieid));
    let json = await response.json();
    return json;
  } catch (error) {
    console.error('Something Went wrong in getMoviesTrailer Function', error);
  }
};

const MovieDetailsScreen = ({ navigation, route }: any) => {
  const [movieData, setMovieData] = useState<any>(undefined);
  const [movieCastData, setmovieCastData] = useState<any>(undefined);
  const [movieTrailer, setMovieTrailer] = useState<any>(undefined);
  const [modalTrailer, setModalTrailer] = useState<any>(false);
  const [playing, setPlaying] = useState(false);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    (async () => {
      const tempMovieData = await getMovieDetails(route.params.movieid);
      setMovieData(tempMovieData);
    })();

    (async () => {
      const tempMovieCastData = await getMovieCastDetails(route.params.movieid);
      setmovieCastData(tempMovieCastData.cast);
    })();

    (async () => {
      const tempMovieTrailer = await getMovieTrailer(route.params.movieid);
      setMovieTrailer(tempMovieTrailer.results[0]);
    })();
  }, []);

  const onStateChange = useCallback((state: any) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  if (
    movieData == undefined &&
    movieData == null &&
    movieCastData == undefined &&
    movieCastData == null &&
    movieTrailer == undefined &&
    movieTrailer == null
  ) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.appHeaderContainer}>
          <AppHeader
            name="close"
            header={''}
            action={() => navigation.goBack()}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Green} />
        </View>
      </ScrollView>
    );
  }
  else
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <StatusBar hidden />

        <View>
          <Modal
          animationType="slide"
          transparent={true}
          visible={modalTrailer}
          onRequestClose={() => {
            setModalTrailer(!modalTrailer);
          }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ flexDirection: 'row', gap: 20, paddingTop: 10, justifyContent: 'flex-end' }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalTrailer(!modalTrailer)}>
                    <AntDesign name="closecircle" size={24} color={COLORS.Green} />
                  </TouchableOpacity>
                </View>
                <View>
                  <YoutubePlayer
                    width={width - 40}
                    height={width / 1.8}
                    play={playing}
                    videoId={movieTrailer?.key}
                    onChangeState={onStateChange}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
          <ImageBackground
            source={{
              uri: baseImagePath('w780', movieData?.backdrop_path),
            }}
            style={styles.imageBG}>
            <LinearGradient
              colors={[COLORS.BlackRGB10, COLORS.Grey]}
              style={styles.linearGradient}>
              <View style={styles.appHeaderContainer}>
                <AppHeader
                  name="close"
                  header={''}
                  action={() => navigation.goBack()}
                />
              </View>
            </LinearGradient>
          </ImageBackground>
          <View style={styles.imageBG}></View>
          <Image
            source={{ uri: baseImagePath('w342', movieData?.poster_path) }}
            style={styles.cardImage}
          />
        </View>

        <View style={styles.timeContainer}>
          <CustomIcon name="clock" style={styles.clockIcon} />
          <Text style={styles.runtimeText}>
            {Math.floor(movieData?.runtime / 60)}h{' '}
            {Math.floor(movieData?.runtime % 60)}m
          </Text>
        </View>

        <View>
          <Text style={styles.title}>{movieData?.title}</Text>
          <View style={styles.genreContainer}>
            {movieData?.genres.map((item: any) => {
              return (
                <View style={styles.genreBox} key={item.id}>
                  <Text style={styles.genreText}>{item.name}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.tagline}>{movieData?.tagline}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.rateContainer}>
            <CustomIcon name="star" style={styles.starIcon} />
            <Text style={styles.runtimeText}>
              {movieData?.vote_average.toFixed(1)} ({movieData?.vote_count})
            </Text>
            <Text style={styles.runtimeText}>
              {movieData?.release_date.substring(8, 10)}{' '}
              {new Date(movieData?.release_date).toLocaleString('default', {
                month: 'long',
              })}{' '}
              {movieData?.release_date.substring(0, 4)}
            </Text>
          </View>
          <Text style={styles.descriptionText}>{movieData?.overview}</Text>
        </View>
        <View style={styles.groupBtn}>
          <TouchableOpacity
            style={[styles.buttonBG, { backgroundColor: COLORS.Orange }]}
            onPress={() => {
              setModalTrailer(!modalTrailer);
              togglePlaying;
            }}>
            <Text style={styles.buttonText}>Xem trailer</Text>
            <AntDesign name="playcircleo" size={20} color={COLORS.White} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonBG}
            onPress={() => {
              navigation.push('SeatBooking', {
                BgImage: baseImagePath('w780', movieData.backdrop_path),
                PosterImage: baseImagePath('original', movieData.poster_path),
              });
            }}>
            <Text style={styles.buttonText}>Chọn ghế</Text>
            <CustomIcon name='ticket' size={20} color={COLORS.White} />
          </TouchableOpacity>
        </View>

        <View>
          <CategoryHeader title="Diễn viên" />
          <FlatList
            data={movieCastData}
            keyExtractor={(item: any) => item.id}
            horizontal
            contentContainerStyle={styles.containerGap24}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <CastCard
                shouldMarginatedAtEnd={true}
                cardWidth={80}
                isFirst={index == 0 ? true : false}
                isLast={index == movieCastData?.length - 1 ? true : false}
                imagePath={baseImagePath('w185', item.profile_path)}
                title={item.original_name}
                subtitle={item.character}
              />
            )}
          />

        </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Grey,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  scrollViewContainer: {
    flex: 1,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  imageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: '100%',
  },
  cardImage: {
    width: '60%',
    aspectRatio: 200 / 300,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  clockIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.WhiteRGBA50,
    marginRight: SPACING.space_8,
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.space_15,
  },
  runtimeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_15,
    textAlign: 'center',
  },
  genreContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.space_20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  genreBox: {
    borderColor: COLORS.WhiteRGBA50,
    borderWidth: 1,
    paddingHorizontal: SPACING.space_10,
    paddingVertical: SPACING.space_4,
    borderRadius: BORDERRADIUS.radius_25,
  },
  genreText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA75,
  },
  tagline: {
    fontFamily: FONTFAMILY.poppins_thin,
    fontSize: FONTSIZE.size_14,
    fontStyle: 'italic',
    color: COLORS.White,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_15,
    textAlign: 'center',
  },
  infoContainer: {
    marginHorizontal: SPACING.space_24,
  },
  rateContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  starIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.Yellow,
  },
  descriptionText: {
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  groupBtn: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonBG: {
    alignItems: 'center',
    marginVertical: SPACING.space_24,
    flexDirection: 'row',
    borderRadius: BORDERRADIUS.radius_10,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    backgroundColor: COLORS.Green,
  },
  buttonText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
    marginRight: SPACING.space_10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 160,
    marginHorizontal: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    margin: 20,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 50,
    marginBottom: 12,
  },
});

export default MovieDetailsScreen;
