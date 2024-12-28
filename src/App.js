import React, {
  useEffect,
  useState,
} from "react";
import supabase from "./supabase";
import "./style.css";
import Header from "./components/Header";
import Loader from "./components/Loader";
import NewFactForm from "./components/NewFactForm";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source:
      "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source:
      "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  const [count, setCount] = useState(8);
  console.log("rendering");

  return (
    <div>
      <span
        style={{ fontSize: "40px" }}
      >
        {count}
      </span>
      <button
        className="btn btn-large"
        onClick={() =>
          setCount((c) => c + 1)
        }
      >
        +1
      </button>
    </div>
  );
}

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

const CATEGORIES = [
  {
    name: "technology",
    color: "#3b82f6",
  },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  {
    name: "entertainment",
    color: "#db2777",
  },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function CategoryFilter({
  setCurrentCategory,
}) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() =>
              setCurrentCategory("all")
            }
          >
            All
          </button>
        </li>
        {CATEGORIES.map((category) => (
          <li
            key={category.name}
            className="category"
          >
            <button
              className="btn btn-category"
              style={{
                backgroundColor:
                  category.color,
              }}
              onClick={() =>
                setCurrentCategory(
                  category.name
                )
              }
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        No facts found for this category
        yet! Create the first one!
      </p>
    );
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact
            key={fact.id}
            fact={fact}
            setFacts={setFacts}
          />
        ))}
      </ul>
      <p>
        There are {facts.length} facts
        in the database. Add your own!
      </p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] =
    useState(false);

  async function handleVote(
    columnName
  ) {
    setIsUpdating(true);
    const { data: updatedFact, error } =
      await supabase
        .from("facts")
        .update({
          [columnName]:
            fact[columnName] + 1,
        })
        .eq("id", fact.id)
        .select();

    setIsUpdating(false);
    if (!error) {
      setFacts((facts) =>
        facts.map((f) =>
          f.id === fact.id
            ? updatedFact[0]
            : f
        )
      );
    }
  }

  return (
    <li className="fact">
      <p>
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor:
            CATEGORIES.find(
              (category) =>
                category.name ===
                fact.category
            ).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-button">
        <button
          onClick={() =>
            handleVote(
              "votesInteresting"
            )
          }
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() =>
            handleVote(
              "votesMindblowing"
            )
          }
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button
          onClick={() =>
            handleVote("votesFalse")
          }
          disabled={isUpdating}
        >
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
