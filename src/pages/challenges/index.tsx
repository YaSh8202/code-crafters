import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import ChallengeCard from "~/components/ChallengeCard";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import PageHeader from "~/components/PageHeader";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, TickOutline } from "~/components/Icones";
import {
  type Dispatch,
  Fragment,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { ChallengeType, Difficulty } from "@prisma/client";

enum SortByOptions {
  MOST_RECENT = "Most recent",
  MOST_STARS = "Most stars",
  DIFFICULTY_EASIER_FIRST = "Difficulty (easier first)",
  DIFFICULTY_HARDER_FIRST = "Difficulty (harder first)",
}

const difficultyValue = {
  [Difficulty.Beginner]: 1,
  [Difficulty.Intermediate]: 2,
  [Difficulty.Advanced]: 3,
};

const ChallengesPage: NextPage = () => {
  const { data: challenges, refetch } = api.challenge.getAll.useQuery();
  const [filteredChallenges, setFilteredChallenges] = useState(challenges);
  const [selectedSortBy, setSelectedSortBy] =
    useState<keyof typeof SortByOptions>("MOST_RECENT");
  const [selectedChallengeTypes, setSelectedChallengeTypes] = useState<
    ChallengeType[]
  >([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty[]>(
    []
  );

  useEffect(() => {
    const challengesCopy = structuredClone(challenges);
    switch (selectedSortBy) {
      case "MOST_RECENT":
        challengesCopy?.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "MOST_STARS":
        challengesCopy?.sort((a, b) =>
          a._count.stars < b._count.stars ? 1 : -1
        );
        break;
      case "DIFFICULTY_EASIER_FIRST":
        challengesCopy?.sort((a, b) => {
          if (a.difficulty === b.difficulty) {
            return a._count.stars < b._count.stars ? 1 : -1;
          }
          return difficultyValue[a.difficulty] > difficultyValue[b.difficulty]
            ? 1
            : -1;
        });
        break;
      case "DIFFICULTY_HARDER_FIRST":
        challengesCopy?.sort((a, b) => {
          if (a.difficulty === b.difficulty) {
            return a._count.stars < b._count.stars ? 1 : -1;
          }
          return difficultyValue[a.difficulty] < difficultyValue[b.difficulty]
            ? 1
            : -1;
        });
        break;
    }
    if (
      selectedChallengeTypes.length === 0 &&
      selectedDifficulty.length === 0
    ) {
      setFilteredChallenges(challengesCopy);
      return;
    }
    const filteredChallenges = challengesCopy?.filter((challenge) => {
      if (
        (selectedChallengeTypes.length === 0 ||
          selectedChallengeTypes.includes(challenge.type)) &&
        (selectedDifficulty.length === 0 ||
          selectedDifficulty.includes(challenge.difficulty))
      ) {
        return true;
      }
      return false;
    });
    setFilteredChallenges(filteredChallenges);
  }, [selectedChallengeTypes, selectedDifficulty, challenges, selectedSortBy]);

  return (
    <>
      <Head>
        <title >Code Crafters</title>
      </Head>
      <PageHeader pageTitle={"Challenges"}>
        <div className="flex h-full">
          <div className="flex h-full items-center border-l px-4 ">
            <SortByMenu
              selected={selectedSortBy}
              setSelected={setSelectedSortBy}
            />
          </div>
          <div className="flex h-full items-center border-x px-4  ">
            <FilterBy
              selectedChallengeTypes={selectedChallengeTypes}
              setSelectedChallengeTypes={setSelectedChallengeTypes}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
            />
          </div>
        </div>
      </PageHeader>
      <main className=" mx-auto mt-4 max-w-7xl  ">
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-8 mt-32">
          {filteredChallenges?.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              refetch={refetch}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();
  await ssg.challenge.getAll.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 10 * 60, // 10 minutes
  };
};

// const SortByOptions = ["Most recent", "Most stars", "Difficulty (easier first)", "Difficulty (harder first)"] as const;

const SortByMenu = ({
  selected,
  setSelected,
}: {
  selected: keyof typeof SortByOptions;
  setSelected: (option: keyof typeof SortByOptions) => void;
}) => {
  return (
    <div className="">
      <Menu as="div" className="relative z-20 inline-block text-left ">
        <div>
          <Menu.Button className="inline-flex w-full justify-center py-2 text-sm font-medium uppercase  text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-opacity-75">
            Sort By
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-700 hover:text-violet-600"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {Object.keys(SortByOptions).map((option) => (
              <div key={option} className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        void setSelected(option as keyof typeof SortByOptions);
                      }}
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm ${
                        selected === option
                          ? "border-r-4 border-violet-600"
                          : ""
                      } `}
                    >
                      {SortByOptions[option as keyof typeof SortByOptions]}
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

const FilterBy = ({
  selectedDifficulty,
  setSelectedDifficulty,
  selectedChallengeTypes,
  setSelectedChallengeTypes,
}: {
  selectedDifficulty: Difficulty[];
  setSelectedDifficulty: Dispatch<SetStateAction<Difficulty[]>>;
  selectedChallengeTypes: ChallengeType[];
  setSelectedChallengeTypes: Dispatch<SetStateAction<ChallengeType[]>>;
}) => {
  return (
    <div className="">
      <Menu as="div" className="relative z-20 inline-block text-left ">
        <div>
          <Menu.Button className="inline-flex w-full justify-center py-2 text-sm font-medium uppercase  text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-opacity-75">
            Filter By
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-700 hover:text-violet-600"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 max-h-[20rem] w-56 origin-top-right divide-y divide-gray-100 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
            <p className="px-3 py-2 text-gray-400">Difficulty</p>
            {/* <div> */}
            {Object.keys(Difficulty).map((option) => (
              <div key={option} className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        // void setSelected(option as keyof typeof SortByOptions);
                        setSelectedDifficulty((prev) =>
                          prev.includes(option as Difficulty)
                            ? prev.filter((d) => d !== option)
                            : [...prev, option as Difficulty]
                        );
                      }}
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group relative flex w-full items-center rounded-md px-8 py-2 text-sm  `}
                    >
                      {selectedDifficulty.includes(option as Difficulty) ? (
                        <TickOutline className="absolute left-3 text-blue-600 " />
                      ) : null}
                      {Difficulty[option as keyof typeof Difficulty]}
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
            {/* </div> */}
            <p className="px-3 py-2 text-gray-400 ">Type</p>
            {/* <div className=" no-scrollbar max-h-[10rem] overflow-auto "> */}
            {Object.keys(ChallengeType).map((option) => (
              <div key={option} className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setSelectedChallengeTypes((prev) =>
                          prev.includes(option as ChallengeType)
                            ? prev.filter((d) => d !== option)
                            : [...prev, option as ChallengeType]
                        );
                      }}
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group relative flex w-full items-center rounded-md px-8 py-2 text-sm  `}
                    >
                      {selectedChallengeTypes.includes(
                        option as ChallengeType
                      ) ? (
                        <TickOutline className="absolute left-3 text-blue-600 " />
                      ) : null}
                      {ChallengeType[option as keyof typeof ChallengeType]}
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
            {/* </div> */}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default ChallengesPage;
