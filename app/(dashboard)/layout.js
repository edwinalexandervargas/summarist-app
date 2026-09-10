import SearchBar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <div className="dashboard__content">
        <div className="dashboard__header">
          <SearchBar />
        </div>
        <main className="dashboard__main">
          {children}
        </main>
      </div>
    </div>
  );
}