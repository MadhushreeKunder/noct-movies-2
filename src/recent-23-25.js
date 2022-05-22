import "./index.css";
import "antd/dist/antd.css";
import axios from "axios";
import { useState } from "react";
import { Button, Input, Space, Table } from "antd";

const { Search } = Input;

export default function Pap() {
  const columns = [
    // {
    //   title: "Title",
    //   dataIndex: "Title",
    //   key: "Title",
    //   render: (text) => <b>{text} </b>,
    //   sorter: (a, b) => a.Title.localeCompare(b.Title)
    // },
    // {
    //   title: "Release Date",
    //   dataIndex: "Year", //change to release date
    //   key: "Year", //change to release date
    //   sorter: {
    //     compare: (a, b) => a.Year - b.Year
    //   }
    // },
    // {
    //   title: "Director",
    //   dataIndex: "Director",
    //   key: "Director"
    // },
    {
      title: "imdbID",
      dataIndex: "imdbID",
      key: "imdbID"
    }
  ];

  const [movieName, setMovieName] = useState();
  const [totalResults, setTotalResults] = useState();
  const [moviesList, setMoviesList] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSubmit = async (movie) => {
    setMovieName(movie);

    try {
      await axios
        .get(`https://www.omdbapi.com/?apikey=5dc53862&type=movie&s=${movie}`)
        .then((data) => {
          console.log("data", data);
          setMoviesList(data.data.Search);
          setTotalResults(data.data.totalResults);
        });
      // .then(
      //   moviesList.forEach(async (movie) => {
      //     await axios
      //       .get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=5dc53862`)
      //       .then((res) => {
      //         console.log("res.data", res.data);
      //         setMovieDetails(res.data);
      //       });
      //   })
    } catch (error) {
      console.log(error);
    }

    await moviesList.forEach(async (movie) => {
      await axios
        .get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=5dc53862`)
        .then((response) => {
          console.log("response.data", response.data);
          setMovieDetails(response.data);
          console.log("moviesList", moviesList);
        });
    });
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
          // dataSource={movieDetails}
          pagination={{
            defaultCurrent: 1,
            pageSize: 10,
            total: totalResults
          }}
          bordered
        />
      </div>
    </div>
  );
}
