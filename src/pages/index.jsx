import FeedPost from "../components/FeedPost"
import styles from "../styles/Home.module.css";
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  useExplorePublicationsQuery,
} from "../graphql/generated";

export default function Home() {
  const { isLoading, error, data } = useExplorePublicationsQuery({
    request: {
      sortCriteria: PublicationSortCriteria.Latest,
      metadata: {
        // mainContentFocus: PublicationMainFocus.
      }
    },
  }, {
    //禁止自动refetch页面
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  if (error) {
    return <div className={styles.container}>Error</div>;
  }

  if (isLoading) {
    return <div className={styles.container}>Loading</div>;
  }

    return (
      <div className={styles.container}>
        <div className={styles.postContainer}>
          {data?.explorePublications.items.map((publication) => (
            <FeedPost publication={publication} key={publication.id} />
          ))}
        </div>
      </div>
    );
}
