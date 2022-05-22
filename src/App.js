import "./index.css";
import "antd/dist/antd.css";
import axios from "axios";
import { useState } from "react";
import { Button, Input, Space, Table, Tag } from "antd";

const { Search } = Input;

export default function App() {
  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      render: (text) => <b>{text} </b>,
      sorter: (a, b) => a.Title.localeCompare(b.Title)
    },
    {
      title: "Released",
      dataIndex: "Year",
      key: "Year",
      sorter: {
        compare: (a, b) => a.Year - b.Year
      }
    },
    {
      title: "Director",
      dataIndex: "Director",
      key: "Director"
    },
    {
      title: "Genre",
      key: "Genre",
      dataIndex: "Genre",
      render: (genre) => (
        <>
          {genre.split(",").map((genre) => {
            let color = genre.length > 6 ? "geekblue" : "green";

            return (
              <Tag color={color} key={genre}>
                {genre.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: "Rotten Tomatoes Rating",
      dataIndex: ["Ratings", "Value"],
      key: "Ratings"
      // render: {Ratings[1].Value}
      //  to filter data:
      //       const users = ["John", "Doe", "Stephen", "Matt", "Abigail", "Susu"];

      // const topThree = users.filter((element, index) => {
      //     return index == 2;
      // });

      // console.log(topThree);
    },
    {
      title: "imdbID",
      dataIndex: "imdbID",
      key: "imdbID"
    }
  ];

  const [movieName, setMovieName] = useState();
  const [totalResults, setTotalResults] = useState();
  const [movieDetails, setMovieDetails] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [moviesList, setMoviesList] = useState([]);

  const handleSubmit = async (movie) => {
    setMovieName(movie);
    let moviesArray = [];

    let res = await fetch(
      `https://www.omdbapi.com/?apikey=5dc53862&type=movie&s=${movie}`
    );
    let data = await res.json();
    setTotalResults(data.totalResults);

    // const moviesList = data.Search;
    setMoviesList(data.Search);

    moviesList.forEach(async (movie) => {
      let response = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=5dc53862`
      );
      let moviesListData = await response.json();
      moviesArray.push(moviesListData);
      setMovieDetails(moviesArray);
    });
    console.log("array is", movieDetails);
  };

  const paginationData = (page, pageSize) => {
    (async () => {
      try {
        await axios
          .get(
            `https://www.omdbapi.com/?apikey=5dc53862&type=movie&s=${movieName}&page=${page}`
          )
          .then((data) => {
            console.log(data.data.Search);
            setMoviesList(data.data.Search);
          });
      } catch (error) {
        console.log(error);
      }
    })();
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <div className="App">
      <div className="body">
        <h1>Movie Search App</h1>
        <Search
          placeholder="Search Movies"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSubmit}
          className="search-btn"
        />
        <Button
          type="primary"
          onClick={() => console.log("movieDetails", movieDetails)}
        >
          Data{" "}
        </Button>
        <Table
          columns={columns}
          dataSource={movieDetails}
          pagination={{
            defaultCurrent: 1,
            current: page,
            pageSize: pageSize,
            total: totalResults,
            onChange: paginationData
          }}
          bordered
        />
      </div>
    </div>
  );
}
