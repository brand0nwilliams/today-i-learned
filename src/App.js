import React, {
  useEffect,
  useState,
} from "react";
import supabase from "./supabase";
import "./style.css";
import Header from "./components/Header";
import Loader from "./components/Loader";
import NewFactForm from "./components/NewFactForm";
import CategoryFilter from "./components/CategoryFilter";
import FactList from "./components/FactList";

function App() {
  const [showForm, setShowForm] =
    useState(false);
  const [facts, setFacts] = useState(
    []
  );
  const [isLoading, setIsLoading] =
    useState(false);
  const [
    currentCategory,
    setCurrentCategory,
  ] = useState("all");

  useEffect(() => {
    setIsLoading(true);

    let query = supabase
      .from("facts")
      .select("*");

    if (currentCategory !== "all") {
      query = query.eq(
        "category",
        currentCategory
      );
    }

    async function getFacts() {
      let { data: facts, error } =
        await query
          .order("votesInteresting", {
            ascending: false,
          })
          .limit(1000);

      if (!error) {
        setFacts(facts);
      } else {
        alert(
          "An error occurred. Please try again later."
        );
      }
      setIsLoading(false);
    }
    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header
        showForm={showForm}
        setShowForm={setShowForm}
      />
      {showForm ? (
        <NewFactForm
          setFacts={setFacts}
          setShowForm={setShowForm}
        />
      ) : null}
      <main className="main">
        <CategoryFilter
          setCurrentCategory={
            setCurrentCategory
          }
        />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList
            facts={facts}
            setFacts={setFacts}
          />
        )}
      </main>
    </>
  );
}

export default App;
