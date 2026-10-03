import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Database,
  GitBranch,
  Sparkles,
  FileCheck2,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Download,
  UploadCloud,
  ArrowRight,
  CircleCheck,
  CircleAlert,
  Trash2,
  Copy,
  Menu,
  X,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./App.css";

const API_URL = "http://127.0.0.1:8000";

/* =========================================================
   NAVIGATION
========================================================= */

const NAV_ITEMS = [
  {
    section: "MAIN",
    items: [
      {
        id: "overview",
        label: "Overview",
        icon: LayoutDashboard,
      },
      {
        id: "upload",
        label: "Upload Dataset",
        icon: Upload,
      },
      {
        id: "quality",
        label: "Quality Analysis",
        icon: BarChart3,
      },
      {
        id: "cleaned",
        label: "Cleaned Data",
        icon: FileCheck2,
      },
      {
        id: "etl",
        label: "ETL Pipeline",
        icon: GitBranch,
      },
      {
        id: "ai",
        label: "AI Insights",
        icon: Sparkles,
      },
    ],
  },
  {
    section: "DATA",
    items: [
      {
        id: "records",
        label: "Dataset Records",
        icon: Database,
      },
      {
        id: "mysql",
        label: "MySQL Database",
        icon: Server,
      },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      {
        id: "api",
        label: "API Status",
        icon: Activity,
      },
    ],
  },
];

/* =========================================================
   APP
========================================================= */

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState("");
  const [mysqlLoadResult, setMysqlLoadResult] = useState(null);
  const [activePage, setActivePage] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [message, setMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  /* =======================================================
     FILE SELECT
  ======================================================= */

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setAiInsights("");
    setMysqlLoadResult(null);
    setMessage("");
  };

  /* =======================================================
     ANALYZE
  ======================================================= */

  const analyzeFile = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze dataset.");
      }

      const data = await response.json();

      setResult(data);
      setLastUpdated(new Date());
      setAiInsights("");
      setActivePage("overview");
      setMessage("Dataset analyzed successfully.");
    } catch (error) {
      console.error(error);
      setMessage(
        error.message ||
          "Unable to analyze the dataset. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     AI INSIGHTS
  ======================================================= */

  const getAIInsights = async () => {
  if (!file) {
    setMessage("Please select a CSV file first.");
    return;
  }

  setAiLoading(true);
  setMessage("");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/ai-insights`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to generate AI insights."
      );
    }

    setLastUpdated(new Date());

    setAiInsights(
      data.ai_analysis ||
        data.insights ||
        data.analysis ||
        data.message ||
        "No AI insights were returned."
    );
  } catch (error) {
    console.error("AI Insights Error:", error);

    setMessage(
      error.message ||
        "Unable to generate AI insights. Please try again."
    );
  } finally {
    setAiLoading(false);
  }
};

  /* =======================================================
     DOWNLOAD CLEANED CSV
  ======================================================= */

  const downloadCleanedCSV = async () => {
    if (!file) {
      setMessage("Please upload and analyze a CSV file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/clean`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate cleaned CSV.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "cleaned_customers.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setLastUpdated(new Date());
      setMessage("Cleaned CSV downloaded successfully.");
    } catch (error) {
      console.error(error);
      setMessage(
        error.message || "Unable to download cleaned CSV."
      );
    }
  };

  /* =======================================================
     LOAD MYSQL
  ======================================================= */

  const loadToMySQL = async () => {
    if (!file) {
      setMessage("Please upload a CSV file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/load`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to load data into MySQL.");
      }

      const data = await response.json();

      setMysqlLoadResult(data);
      setLastUpdated(new Date());
      setMessage(
        data.message || "Data loaded into MySQL successfully."
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error.message ||
          "Unable to load data into MySQL."
      );
    }
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigate = (page) => {
    setActivePage(page);
    setMobileMenu(false);
    setMessage("");
  };

  /* =======================================================
     PAGE TITLE
  ======================================================= */

  const getPageInfo = () => {
    const pages = {
      overview: {
        title: "Overview",
        subtitle: "Data quality and ETL pipeline at a glance",
      },
      upload: {
        title: "Upload Dataset",
        subtitle: "Upload a CSV file for quality analysis",
      },
      quality: {
        title: "Quality Analysis",
        subtitle: "Inspect the quality of your dataset",
      },
      cleaned: {
        title: "Cleaned Data",
        subtitle: "Review and download the cleaned dataset",
      },
      etl: {
        title: "ETL Pipeline",
        subtitle: "Track the data ingestion and transformation flow",
      },
      ai: {
        title: "AI Insights",
        subtitle: "Gemini-powered data quality interpretation",
      },
      records: {
        title: "Dataset Records",
        subtitle: "Explore the analyzed customer records",
      },
      mysql: {
        title: "MySQL Database",
        subtitle: "Load and manage cleaned data in MySQL",
      },
      api: {
        title: "API Status",
        subtitle: "Monitor DataMedic backend availability",
      },
    };

    return pages[activePage] || pages.overview;
  };

  const pageInfo = getPageInfo();

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="app-shell">
      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-button"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            DM
          </div>

          <div className="brand-text">
            <h1>DataMedic AI</h1>
            <span>DATA QUALITY & ETL</span>
          </div>
        </div>

        <div className="sidebar-scroll">
          {NAV_ITEMS.map((section) => (
            <div
              className="nav-section"
              key={section.section}
            >
              <div className="nav-section-title">
                {section.section}
              </div>

              <nav className="sidebar-nav">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      className={`nav-item ${
                        active ? "active" : ""
                      }`}
                      onClick={() => navigate(item.id)}
                    >
                      <Icon size={17} strokeWidth={1.9} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="sidebar-footer">
          <div className="status-dot"></div>

          <div>
            <strong>DataMedic AI</strong>
            <span>Data Quality &amp; ETL v1.0</span>
          </div>
        </div>
      </aside>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="main">
        <header className="page-header">
          <div>
            <h2>{pageInfo.title}</h2>
            <p>{pageInfo.subtitle}</p>
          </div>

          <div className="header-actions">
            <span className="last-updated">
              Updated {lastUpdated.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, 
              })
              .replace("am", "AM")
              .replace("pm", "PM")}
            </span>

            <button
              className="refresh-button"
              onClick={() => {
                setLastUpdated(new Date());
                window.location.reload();
              }}
            >
              <RefreshCw size={11} />
              Refresh
            </button>
          </div>
        </header>

        {message && (
          <div className="notification">
            <CircleCheck size={17} />
            <span>{message}</span>
          </div>
        )}

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        {activePage === "overview" && (
          <OverviewPage
            result={result}
            navigate={navigate}
            analyzeFile={analyzeFile}
            loading={loading}
            getAIInsights={getAIInsights}
            downloadCleanedCSV={downloadCleanedCSV}
            loadToMySQL={loadToMySQL}
          />
        )}

        {activePage === "upload" && (
          <UploadPage
            file={file}
            handleFileChange={handleFileChange}
            analyzeFile={analyzeFile}
            loading={loading}
            result={result}
          />
        )}

        {activePage === "quality" && (
          <QualityPage
            result={result}
            navigate={navigate}
          />
        )}

        {activePage === "cleaned" && (
          <CleanedDataPage
            result={result}
            downloadCleanedCSV={downloadCleanedCSV}
            navigate={navigate}
          />
        )}

        {activePage === "etl" && (
          <ETLPage
            file={file}
            result={result}
            mysqlLoadResult={mysqlLoadResult}
            aiInsights={aiInsights}
            loadToMySQL={loadToMySQL}
          />
        )}

        {activePage === "ai" && (
          <AIInsightsPage
            result={result}
            aiInsights={aiInsights}
            aiLoading={aiLoading}
            getAIInsights={getAIInsights}
          />
        )}

        {activePage === "records" && (
          <DatasetRecordsPage result={result} />
        )}

        {activePage === "mysql" && (
          <MySQLPage
            result={result}
            file={file}
            mysqlLoadResult={mysqlLoadResult}
            loadToMySQL={loadToMySQL}
          />
        )}

        {activePage === "api" && (
          <APIStatusPage
            mysqlConnected={mysqlLoadResult?.status === "success"}
            geminiAvailable={Boolean(aiInsights)}
          />
        )}
      </main>
    </div>
  );
}

function QualityBarChart({
  missingValues,
  duplicateRecords,
  invalidAges,
  invalidEmails,
}) {
  const data = [
    { name: "Missing", value: Number(missingValues) || 0 },
    { name: "Duplicates", value: Number(duplicateRecords) || 0 },
    { name: "Invalid Age", value: Number(invalidAges) || 0 },
    { name: "Invalid Email", value: Number(invalidEmails) || 0 },
  ];

  return (
    <div className="quality-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -18, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#858a93", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#858a93", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "#f4f5f7" }}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e8e8e8",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(17, 24, 39, 0.08)",
              fontSize: "13px",
            }}
          />
          <Bar
            dataKey="value"
            name="Issues"
            fill="#1952ce"
            radius={[6, 6, 0, 0]}
            barSize={80}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* =========================================================
   OVERVIEW PAGE
========================================================= */

function OverviewPage({
  result,
    navigate,
    analyzeFile,
    loading,
    getAIInsights,
  downloadCleanedCSV,
  loadToMySQL,
}) {
  const report = result?.quality_report ?? result;
  const totalRecords = report?.total_records ?? "—";

  const qualityScore = report?.quality_score ?? "—";

  const missingValues = report?.missing_values ?? 0;

  const duplicateRecords = report?.duplicate_records ?? 0;

  const invalidAges = report?.invalid_age_records ?? 0;

  const invalidEmails = report?.invalid_email_records ?? 0;

    const issues =
      result
        ? missingValues + duplicateRecords + invalidAges + invalidEmails
        : "—";

  const cleanRecords = result
    ? result.cleaned_records ?? Math.max(totalRecords - duplicateRecords, 0)
    : "—";

  return (
    <div className="page-container">

      {/* METRICS */}

      <div className="stats">
        <StatCard
          label="TOTAL RECORDS"
          value={totalRecords}
          description="Records in dataset"
          icon={Database}
        />

        <StatCard
          label="QUALITY SCORE"
          value={`${qualityScore}%`}
          description="Overall data quality"
          icon={CheckCircle2}
        />

        <StatCard
          label="ISSUES DETECTED"
          value={issues}
          description="Quality issues found"
          icon={AlertTriangle}
        />

        <StatCard
          label="CLEAN RECORDS"
          value={cleanRecords}
          description="Records after cleaning"
          icon={FileCheck2}
        />
      </div>

      {/* QUICK ACTIONS */}

      <div className="panel quick-actions-panel">
        <PanelHeader
          title="Quick Actions"
          description="Work with your dataset"
          icon={Activity}
        />

        <div className="quick-actions">

          <QuickAction
            icon={UploadCloud}
            title="Upload Dataset"
            description="Select a CSV file"
            onClick={() => navigate("upload")}
            variant="upload"
          />

          <QuickAction
            icon={BarChart3}
            title="Analyze Dataset"
            description={loading ? "Analysis in progress" : "Run quality checks"}
            onClick={analyzeFile}
            variant="analyze"
          />

          <QuickAction
            icon={Sparkles}
            title="Generate AI Insights"
            description="Get Gemini recommendations"
            onClick={() => {
              getAIInsights();
              navigate("ai");
            }}
            variant="ai"
          />

          <QuickAction
            icon={Download}
            title="Download Cleaned Data"
            description="Export the cleaned CSV"
            onClick={downloadCleanedCSV}
            variant="download"
          />

          <QuickAction
            icon={Database}
            title="Load to MySQL"
            description="Send cleaned records to the database"
            onClick={loadToMySQL}
            variant="mysql"
          />

        </div>
      </div>

      {/* DATA QUALITY GRAPH */}

      <div className="panel chart-panel overview-quality-panel">
        <div className="panel-header chart-panel-header">
          <div>
            <h3>Data Quality Overview</h3>
            <p>Detected issues by category</p>
          </div>

           <button
      className="view-analytics-button"
      onClick={() => navigate("quality")}
    >
      View analytics
      <ArrowRight size={15} />
    </button>
        </div>

        {!result ? (
          <EmptyState
            icon={UploadCloud}
            title="No Dataset Analyzed"
            description="Upload and analyze a CSV dataset to see the quality graph."
            buttonText="Upload Dataset"
            onClick={() => navigate("upload")}
          />
        ) : (
          <QualityBarChart
            missingValues={missingValues}
            duplicateRecords={duplicateRecords}
            invalidAges={invalidAges}
            invalidEmails={invalidEmails}
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   UPLOAD PAGE
========================================================= */

function UploadPage({
  file,
  handleFileChange,
  analyzeFile,
  loading,
  result,
}) {
  return (
    <div className="page-container">

      <div className="panel upload-panel">

        <PanelHeader
          title="Upload Dataset"
          description="Upload a CSV file to begin the data quality pipeline"
          icon={UploadCloud}
        />

        <label className="upload-box">

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          <div className="upload-icon">
            <UploadCloud size={32} />
          </div>

          <h3>
            {file
              ? file.name
              : "Choose your CSV dataset"}
          </h3>

          <p>
            CSV files only · Upload your customer dataset
          </p>

          <span className="upload-button datamedic-upload-button">
            Browse CSV
          </span>

        </label>

        {file && (
          <div className="selected-file">
            <div>
              <FileCheck2 size={20} />

              <div>
                <strong>{file.name}</strong>
                <span>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            <CheckCircle2 size={20} />
          </div>
        )}

        <button
          className="primary-button datamedic-analyze-button"
          onClick={analyzeFile}
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <RefreshCw
                size={17}
                className="spin"
              />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 size={17} />
              Analyze Dataset
            </>
          )}
        </button>

      </div>

      {result && (
        <div className="panel">
          <PanelHeader
            title="Dataset Ready"
            description="Your dataset has already been analyzed"
            icon={CheckCircle2}
          />

          <div className="success-box">
            <CheckCircle2 size={22} />

            <div>
              <strong>
                Analysis completed successfully
              </strong>

              <p>
                You can now review the quality analysis,
                cleaned data, or ETL pipeline.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   QUALITY PAGE
========================================================= */

function QualityPage({ result, navigate }) {
  const [animatedQualityScore, setAnimatedQualityScore] = useState(0);

  const qualityScore = Number(
    result?.quality_report?.quality_score ??
    result?.quality_score ??
    0
  );

  useEffect(() => {
    if (!result) {
      setAnimatedQualityScore(0);
      return;
    }

    setAnimatedQualityScore(0);

    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      setAnimatedQualityScore(
        Math.round(progress * qualityScore)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [qualityScore, result]);

  if (!result) {
    return (
      <div className="page-container">
        <div className="panel">
          <EmptyState
            icon={BarChart3}
            title="No Dataset Analyzed"
            description="Upload and analyze a CSV dataset first."
            buttonText="Upload Dataset"
            onClick={() => navigate("upload")}
          />
        </div>
      </div>
    );
  }

  const report = result?.quality_report ?? result;
  const totalRecords = report?.total_records ?? 0;
  const missingValues = report?.missing_values ?? 0;
  const duplicateRecords = report?.duplicate_records ?? 0;
  const invalidAges = report?.invalid_age_records ?? 0;
  const invalidEmails = report?.invalid_email_records ?? 0;

  return (
    <div className="page-container">

      <div className="stats quality-stats">

        <StatCard
          label="TOTAL RECORDS"
          value={totalRecords}
          description="Records analyzed"
          icon={Database}
        />

        <StatCard
          label="MISSING VALUES"
          value={missingValues}
          description="Empty fields"
          icon={AlertTriangle}
        />

        <StatCard
          label="INVALID AGES"
          value={invalidAges}
          description="Invalid age values"
          icon={XCircle}
        />

        <StatCard
          label="DUPLICATE RECORDS"
          value={duplicateRecords}
          description="Duplicate email records"
          icon={Copy}
        />

        <StatCard
          label="QUALITY SCORE"
          value={`${qualityScore}%`}
          description="Overall dataset quality"
          icon={CheckCircle2}
        />

        <StatCard
          label="INVALID EMAILS"
          value={invalidEmails}
          description="Invalid email values"
          icon={XCircle}
        />

      </div>

      <div className="panel">

        <PanelHeader
          title="Data Quality Report"
          description="Detailed quality metrics from the current analysis"
          icon={BarChart3}
        />

        <div className="analysis-chart-wrap">
          <QualityBarChart
            missingValues={missingValues}
            duplicateRecords={duplicateRecords}
            invalidAges={invalidAges}
            invalidEmails={invalidEmails}
          />
        </div>

      </div>

      <div className="panel">

        <PanelHeader
          title="Quality Score"
          description="Overall assessment of the dataset"
          icon={CircleCheck}
        />

        <div className="score-section">

          <div className="score-number">
            {animatedQualityScore}%
          </div>

          <div className="score-track datamedic-score-track">
            <div
              className="score-fill datamedic-score-fill"
              style={{
                width: `${Math.min(
                  Math.max(animatedQualityScore, 0),
                  100
                )}%`,
              }}
            />
          </div>

          <p>
            The quality score is calculated from the
            detected data quality issues.
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   CLEANED DATA
========================================================= */

function CleanedDataPage({
  result,
  downloadCleanedCSV,
  navigate,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  if (!result) {
    return (
      <div className="page-container">
        <div className="panel">
          <EmptyState
            icon={FileCheck2}
            title="No Cleaned Dataset"
            description="Upload and analyze a CSV file first."
            buttonText="Upload Dataset"
            onClick={() => navigate("upload")}
          />
        </div>
      </div>
    );
  }

  const report = result?.quality_report ?? result;

  const cleanedRecords =
    Number(result?.cleaned_records) || 0;

  const rows = Array.isArray(result?.cleaned_records_data)
    ? result.cleaned_records_data
    : [];

  const getValue = (row, keys) => {
    for (const key of keys) {
      if (
        row?.[key] !== undefined &&
        row?.[key] !== null &&
        row?.[key] !== ""
      ) {
        return row[key];
      }
    }

    return "";
  };

  const getCustomerId = (row) =>
    getValue(row, ["id", "customer_id", "customerId"]);

  const getCustomerName = (row) =>
    getValue(row, ["name", "customer_name", "customerName"]);

  const getCustomerAge = (row) =>
    getValue(row, ["age"]);

  const getCustomerCity = (row) =>
    getValue(row, ["city"]);

  const getCustomerEmail = (row) =>
    getValue(row, ["email"]);

  const cities = [
    "All Cities",
    ...Array.from(
      new Set(
        rows
          .map((row) => getCustomerCity(row))
          .filter(Boolean)
          .map((city) => String(city))
      )
    ),
  ];

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    const id = String(getCustomerId(row)).toLowerCase();
    const name = String(getCustomerName(row)).toLowerCase();
    const email = String(getCustomerEmail(row)).toLowerCase();
    const city = String(getCustomerCity(row));

    const matchesSearch =
      !normalizedSearch ||
      id.includes(normalizedSearch) ||
      name.includes(normalizedSearch) ||
      email.includes(normalizedSearch);

    const matchesCity =
      selectedCity === "All Cities" ||
      city === selectedCity;

    return matchesSearch && matchesCity;
  });

  const recordsPerPage = 5;

  const totalPages = Math.max(
    Math.ceil(filteredRows.length / recordsPerPage),
    1
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * recordsPerPage;

  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("All Cities");
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="page-container">

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="stats">

        <StatCard
          label="ORIGINAL RECORDS"
          value={report?.total_records ?? 0}
          description="Records before cleaning"
          icon={Database}
        />

        <StatCard
          label="CLEAN RECORDS"
          value={cleanedRecords}
          description="Records after cleaning"
          icon={FileCheck2}
        />

        <StatCard
          label="REMOVED"
          value={Math.max(
            (report?.total_records ?? 0) -
              cleanedRecords,
            0
          )}
          description="Records removed"
          icon={Trash2}
        />

        <StatCard
          label="QUALITY SCORE"
          value={`${report?.quality_score ?? 0}%`}
          description="Original dataset score"
          icon={CheckCircle2}
        />

      </div>

      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <div className="cleaned-directory-filters">

        <div className="cleaned-search-box">

          <Search size={16} />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by ID, name or email..."
          />

        </div>

        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="cleaned-filter-select"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="cleaned-clear-button"
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>

      {/* =====================================================
          CUSTOMER DIRECTORY
      ===================================================== */}

      <div className="cleaned-customer-directory">

        <div className="cleaned-directory-title">

          <div>

            <h2>Customer Directory</h2>

            <p>
              Showing {paginatedRows.length} of{" "}
              {filteredRows.length} customers
            </p>

          </div>

          <div className="cleaned-page-indicator">
            Page {safeCurrentPage} / {totalPages}
          </div>

        </div>

        {paginatedRows.length > 0 ? (

          <div className="cleaned-table-wrapper">

            <table className="cleaned-customer-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Age</th>
                  <th>City</th>
                  <th>Email</th>
                  <th></th>
                </tr>

              </thead>

              <tbody>

                {paginatedRows.map((row, index) => {

                  const id = getCustomerId(row);
                  const name = getCustomerName(row);
                  const age = getCustomerAge(row);
                  const city = getCustomerCity(row);
                  const email = getCustomerEmail(row);

                  return (
                    <tr
                      key={`${id}-${index}`}
                    >

                      <td>
                        <strong className="cleaned-customer-id">
                          {id || "—"}
                        </strong>
                      </td>

                      <td>
                        <strong className="cleaned-customer-name">
                          {name || "—"}
                        </strong>
                      </td>

                      <td>
                        {age || "—"}
                      </td>

                      <td>
                        {city || "—"}
                      </td>

                      <td>
                        <span className="cleaned-customer-email">
                          {email || "—"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="cleaned-view-button"
                          onClick={() =>
                            setSelectedCustomer(row)
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="cleaned-no-results">

            <FileCheck2 size={28} />

            <h3>No matching customers</h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        )}

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="cleaned-pagination">

          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() =>
              setCurrentPage(
                Math.max(safeCurrentPage - 1, 1)
              )
            }
          >
            ← Previous
          </button>

          <span>
            Page <strong>{safeCurrentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </span>

          <button
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() =>
              setCurrentPage(
                Math.min(
                  safeCurrentPage + 1,
                  totalPages
                )
              )
            }
          >
            Next →
          </button>

        </div>

      </div>

      {/* =====================================================
          DOWNLOAD CSV
      ===================================================== */}

      <div className="cleaned-download-section">

        <button
          className="primary-button datamedic-download-button"
          onClick={downloadCleanedCSV}
        >
          Download CSV
        </button>

      </div>

      {/* =====================================================
          CUSTOMER DETAILS
      ===================================================== */}

      {selectedCustomer && (

        <div
          className="cleaned-customer-overlay"
          onClick={() => setSelectedCustomer(null)}
        >

          <div
            className="cleaned-customer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="cleaned-customer-modal-header">

              <div>

                <h3>Customer Details</h3>

                <p>
                  {getCustomerName(selectedCustomer)}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                ×
              </button>

            </div>

            <div className="cleaned-customer-details">

              <div>
                <span>ID</span>

                <strong>
                  {getCustomerId(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Name</span>

                <strong>
                  {getCustomerName(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Age</span>

                <strong>
                  {getCustomerAge(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>City</span>

                <strong>
                  {getCustomerCity(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {getCustomerEmail(selectedCustomer) || "—"}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   ETL PAGE
========================================================= */

function ETLPage({
  file,
  result,
  mysqlLoadResult,
  aiInsights,
  loadToMySQL,
}) {
  return (
    <div className="page-container">

      <div className="panel">

        <PanelHeader
          title="ETL Pipeline"
          description="Extract, transform, validate and load your data"
          icon={GitBranch}
        />

        <div className="pipeline">

          <PipelineStep
            number="01"
            title="CSV Input"
            description={
              file
                ? `CSV loaded: ${file.name}`
                : "Waiting for CSV dataset"
            }
            icon={UploadCloud}
            completed={Boolean(file)}
          />

          <div className="pipeline-line"></div>

          <PipelineStep
            number="02"
            title="Quality Analysis"
            description={
              result
                ? "Dataset analysis complete"
                : "Waiting for analysis"
            }
            icon={RefreshCw}
            completed={Boolean(result)}
          />

          <div className="pipeline-line"></div>

          <PipelineStep
            number="03"
            title="Data Cleaning"
            description={
              result
                ? "Cleaned dataset is available"
                : "Waiting for analysis"
            }
            icon={CheckCircle2}
            completed={Boolean(result)}
          />

          <div className="pipeline-line"></div>

          <PipelineStep
            number="04"
            title="MySQL Load"
            description={
              mysqlLoadResult?.status === "success"
                ? "Load completed"
                : "Not loaded"
            }
            icon={Database}
            completed={
              mysqlLoadResult?.status === "success"
            }
          />

          <div className="pipeline-line"></div>

          <PipelineStep
            number="05"
            title="AI Insights"
            description={
              aiInsights
                ? "Gemini analysis generated"
                : "Not generated"
            }
            icon={Sparkles}
            completed={Boolean(aiInsights)}
          />

        </div>

        <button
          className="primary-button datamedic-load-mysql-button"
          onClick={loadToMySQL}
          disabled={!file}
        >
          <Database size={17} />
          Load to MySQL
        </button>

      </div>

    </div>
  );
}
/* =========================================================
   AI INSIGHTS
========================================================= */

function AIInsightsPage({
  result,
  aiInsights,
  aiLoading,
  getAIInsights,
}) {
  return (
    <div className="page-container">

      <div className="panel ai-intro">

        <div className="ai-intro-icon">
          <Sparkles size={25} />
        </div>

        <div>
          <h3>Data Quality AI</h3>

          <p>
            Ask Gemini to interpret the detected data
            quality problems and provide practical
            recommendations.
          </p>
        </div>

      </div>

      <div className="panel">

        {!result ? (
          <EmptyState
            icon={Sparkles}
            title="No Dataset Analyzed"
            description="Upload and analyze a CSV dataset first."
          />
        ) : (
          <>
            {!aiInsights && !aiLoading && (
              <div className="ai-placeholder">

                <div className="ai-placeholder-icon datamedic-ai-icon">
                  <Sparkles size={30} />
                </div>

                <h3>
                  AI Data Quality Assistant
                </h3>

                <p>
                  Gemini can analyze the detected
                  data-quality problems and provide
                  practical recommendations for improving
                  your dataset.
                </p>

               <button
  className="dark-button datamedic-ai-button"
  onClick={getAIInsights}
>
  Generate AI Insights
</button>
              </div>
            )}

            {aiLoading && (
              <div className="ai-placeholder">

                <div className="ai-placeholder-icon">
                  <RefreshCw
                    size={30}
                    className="spin"
                  />
                </div>

                <h3>
                  Gemini is analyzing your dataset...
                </h3>

                <p>
                  DataMedic AI is generating quality
                  insights and recommendations.
                </p>

              </div>
            )}

            {aiInsights && !aiLoading && (
              <div className="ai-result">

                <div className="ai-result-header">

                  <div className="ai-result-icon datamedic-ai-icon">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <h3>
                      Gemini Data Quality Analysis
                    </h3>

                    <p>
                      AI-generated analysis of your dataset
                    </p>
                  </div>

                </div>

                <div className="ai-result-content">
                  {aiInsights}
                </div>

                <button
                  className="secondary-button datamedic-ai-button"
                  onClick={getAIInsights}
                >
                  <RefreshCw size={15} />
                  Generate Again
                </button>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   DATASET RECORDS
========================================================= */

function DatasetRecordsPage({ result }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  if (!result) {
    return (
      <div className="page-container">
        <div className="panel">
          <EmptyState
            icon={Database}
            title="No Dataset Available"
            description="Upload and analyze a CSV dataset to view records."
          />
        </div>
      </div>
    );
  }

  const rows = Array.isArray(result?.records)
    ? result.records
    : [];

  const getValue = (row, keys) => {
    for (const key of keys) {
      if (
        row?.[key] !== undefined &&
        row?.[key] !== null &&
        row?.[key] !== ""
      ) {
        return row[key];
      }
    }

    return "";
  };

  const getCustomerId = (row) =>
    getValue(row, ["id", "customer_id", "customerId"]);

  const getCustomerName = (row) =>
    getValue(row, ["name", "customer_name", "customerName"]);

  const getCustomerAge = (row) =>
    getValue(row, ["age"]);

  const getCustomerCity = (row) =>
    getValue(row, ["city"]);

  const getCustomerEmail = (row) =>
    getValue(row, ["email"]);

  const cities = [
    "All Cities",
    ...Array.from(
      new Set(
        rows
          .map((row) => getCustomerCity(row))
          .filter(Boolean)
          .map((city) => String(city))
      )
    ),
  ];

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    const id = String(getCustomerId(row)).toLowerCase();
    const name = String(getCustomerName(row)).toLowerCase();
    const email = String(getCustomerEmail(row)).toLowerCase();
    const city = String(getCustomerCity(row));

    const matchesSearch =
      !normalizedSearch ||
      id.includes(normalizedSearch) ||
      name.includes(normalizedSearch) ||
      email.includes(normalizedSearch);

    const matchesCity =
      selectedCity === "All Cities" ||
      city === selectedCity;

    return matchesSearch && matchesCity;
  });

  const recordsPerPage = 5;

  const totalPages = Math.max(
    Math.ceil(filteredRows.length / recordsPerPage),
    1
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * recordsPerPage;

  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("All Cities");
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="page-container">

      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <div className="cleaned-directory-filters">

        <div className="cleaned-search-box">

          <Search size={16} />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by ID, name or email..."
          />

        </div>

        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="cleaned-filter-select"
        >
          {cities.map((city) => (
            <option
              key={city}
              value={city}
            >
              {city}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="cleaned-clear-button"
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>

      {/* =====================================================
          DATASET DIRECTORY
      ===================================================== */}

      <div className="cleaned-customer-directory">

        <div className="cleaned-directory-title">

          <div>

            <h2>Dataset Records</h2>

            <p>
              Showing {paginatedRows.length} of{" "}
              {filteredRows.length} records
            </p>

          </div>

          <div className="cleaned-page-indicator">
            Page {safeCurrentPage} / {totalPages}
          </div>

        </div>

        {paginatedRows.length > 0 ? (

          <div className="cleaned-table-wrapper">

            <table className="cleaned-customer-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Age</th>
                  <th>City</th>
                  <th>Email</th>
                  <th></th>
                </tr>

              </thead>

              <tbody>

                {paginatedRows.map((row, index) => {

                  const id = getCustomerId(row);
                  const name = getCustomerName(row);
                  const age = getCustomerAge(row);
                  const city = getCustomerCity(row);
                  const email = getCustomerEmail(row);

                  return (
                    <tr
                      key={`${id}-${index}`}
                    >

                      <td>
                        <strong className="cleaned-customer-id">
                          {id || "—"}
                        </strong>
                      </td>

                      <td>
                        <strong className="cleaned-customer-name">
                          {name || "—"}
                        </strong>
                      </td>

                      <td>
                        {age || "—"}
                      </td>

                      <td>
                        {city || "—"}
                      </td>

                      <td>
                        <span className="cleaned-customer-email">
                          {email || "—"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="cleaned-view-button"
                          onClick={() =>
                            setSelectedCustomer(row)
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="cleaned-no-results">

            <FileCheck2 size={28} />

            <h3>
              {searchTerm || selectedCity !== "All Cities"
                ? "No matching records"
                : "No records available"}
            </h3>

            <p>
              {searchTerm || selectedCity !== "All Cities"
                ? "Try changing your search or filters."
                : "Analyze a dataset to populate the records table."}
            </p>

          </div>

        )}

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="cleaned-pagination">

          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() =>
              setCurrentPage(
                Math.max(safeCurrentPage - 1, 1)
              )
            }
          >
            ← Previous
          </button>

          <span>
            Page <strong>{safeCurrentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </span>

          <button
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() =>
              setCurrentPage(
                Math.min(
                  safeCurrentPage + 1,
                  totalPages
                )
              )
            }
          >
            Next →
          </button>

        </div>

      </div>

      {/* =====================================================
          CUSTOMER DETAILS
      ===================================================== */}

      {selectedCustomer && (

        <div
          className="cleaned-customer-overlay"
          onClick={() =>
            setSelectedCustomer(null)
          }
        >

          <div
            className="cleaned-customer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="cleaned-customer-modal-header">

              <div>

                <h3>Customer Details</h3>

                <p>
                  {getCustomerName(selectedCustomer)}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                ×
              </button>

            </div>

            <div className="cleaned-customer-details">

              <div>
                <span>ID</span>

                <strong>
                  {getCustomerId(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Name</span>

                <strong>
                  {getCustomerName(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Age</span>

                <strong>
                  {getCustomerAge(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>City</span>

                <strong>
                  {getCustomerCity(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {getCustomerEmail(selectedCustomer) || "—"}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
/* =========================================================
   MYSQL PAGE
========================================================= */

function MySQLPage({
  result,
  file,
  mysqlLoadResult,
  loadToMySQL,
}) {
  const databaseReport = mysqlLoadResult?.quality_report;

  const databaseRows =
  Array.isArray(result?.cleaned_records_data)
    ? result.cleaned_records_data
    : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const getValue = (row, keys) => {
    for (const key of keys) {
      if (
        row?.[key] !== undefined &&
        row?.[key] !== null &&
        row?.[key] !== ""
      ) {
        return row[key];
      }
    }

    return "";
  };

  const getCustomerId = (row) =>
    getValue(row, ["id", "customer_id", "customerId"]);

  const getCustomerName = (row) =>
    getValue(row, ["name", "customer_name", "customerName"]);

  const getCustomerAge = (row) =>
    getValue(row, ["age"]);

  const getCustomerCity = (row) =>
    getValue(row, ["city"]);

  const getCustomerEmail = (row) =>
    getValue(row, ["email"]);

  const cities = [
    "All Cities",
    ...Array.from(
      new Set(
        databaseRows
          .map((row) => getCustomerCity(row))
          .filter(Boolean)
          .map((city) => String(city))
      )
    ),
  ];

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredRows = databaseRows.filter((row) => {
    const id = String(getCustomerId(row)).toLowerCase();
    const name = String(getCustomerName(row)).toLowerCase();
    const email = String(getCustomerEmail(row)).toLowerCase();
    const city = String(getCustomerCity(row));

    const matchesSearch =
      !normalizedSearch ||
      id.includes(normalizedSearch) ||
      name.includes(normalizedSearch) ||
      email.includes(normalizedSearch);

    const matchesCity =
      selectedCity === "All Cities" ||
      city === selectedCity;

    return matchesSearch && matchesCity;
  });

  const recordsPerPage = 5;

  const totalPages = Math.max(
    Math.ceil(filteredRows.length / recordsPerPage),
    1
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * recordsPerPage;

  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("All Cities");
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="page-container">

      <div className="stats">

        <StatCard
          label="DATABASE"
          value="MySQL"
          description="Relational database"
          icon={Database}
        />

        <StatCard
          label="STATUS"
          value={
            mysqlLoadResult?.status === "success"
              ? "Connected"
              : "Unverified"
          }
          description="Verified by a successful load"
          icon={CircleCheck}
        />

        <StatCard
          label="RECORDS"
          value={mysqlLoadResult?.records_loaded ?? "—"}
          description="Records reported as loaded"
          icon={Server}
        />

        <StatCard
          label="PIPELINE"
          value="ETL"
          description="Load destination"
          icon={GitBranch}
        />

      </div>

      {/* =====================================================
          MYSQL DATABASE
      ===================================================== */}

      <div className="panel">

        <PanelHeader
          title="MySQL Database"
          description="Load the cleaned dataset into MySQL"
          icon={Database}
        />

        <div className="database-card">

          <div className="database-icon datamedic-mysql-icon">
            <Database size={30} />
          </div>

          <div className="database-info">

            <h3>MySQL Database</h3>

            <p>
              {mysqlLoadResult?.status === "success"
                ? mysqlLoadResult.message ||
                  "The load endpoint confirmed a successful database load."
                : "Database connectivity has not been verified in this session. Load a dataset to verify the connection."}
            </p>

            <div className="database-tags">

              <span>MySQL</span>

              <span>
                {file?.name || "No dataset selected"}
              </span>

              <span>
                {databaseReport?.total_records ?? "—"} analyzed rows
              </span>

            </div>

          </div>

          <button
            className="primary-button datamedic-mysql-load-button"
            onClick={loadToMySQL}
            disabled={!file}
          >
            Load Data
          </button>

        </div>

      </div>

      {/* =====================================================
          DATABASE RECORDS
      ===================================================== */}

      <div className="cleaned-directory-filters">

        <div className="cleaned-search-box">

          <Search size={16} />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by ID, name or email..."
          />

        </div>

        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="cleaned-filter-select"
        >
          {cities.map((city) => (
            <option
              key={city}
              value={city}
            >
              {city}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="cleaned-clear-button"
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>

      <div className="cleaned-customer-directory">

        <div className="cleaned-directory-title">

          <div>

            <h2>Database Records</h2>

            <p>
              Showing {paginatedRows.length} of{" "}
              {filteredRows.length} records
            </p>

          </div>

          <div className="cleaned-page-indicator">
            Page {safeCurrentPage} / {totalPages}
          </div>

        </div>

        {paginatedRows.length > 0 ? (

          <div className="cleaned-table-wrapper">

            <table className="cleaned-customer-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Age</th>
                  <th>City</th>
                  <th>Email</th>
                  <th></th>
                </tr>

              </thead>

              <tbody>

                {paginatedRows.map((row, index) => {

                  const id = getCustomerId(row);
                  const name = getCustomerName(row);
                  const age = getCustomerAge(row);
                  const city = getCustomerCity(row);
                  const email = getCustomerEmail(row);

                  return (
                    <tr
                      key={`${id}-${index}`}
                    >

                      <td>
                        <strong className="cleaned-customer-id">
                          {id || "—"}
                        </strong>
                      </td>

                      <td>
                        <strong className="cleaned-customer-name">
                          {name || "—"}
                        </strong>
                      </td>

                      <td>
                        {age || "—"}
                      </td>

                      <td>
                        {city || "—"}
                      </td>

                      <td>
                        <span className="cleaned-customer-email">
                          {email || "—"}
                        </span>
                      </td>

                      <td>

                        <button
                          type="button"
                          className="cleaned-view-button"
                          onClick={() =>
                            setSelectedCustomer(row)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="cleaned-no-results">

            <Database size={28} />

            <h3>
              {searchTerm ||
              selectedCity !== "All Cities"
                ? "No matching records"
                : "No database records available"}
            </h3>

            <p>
              {searchTerm ||
              selectedCity !== "All Cities"
                ? "Try changing your search or filters."
                : "Analyze and load a dataset to populate the database records."}
            </p>

          </div>

        )}

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="cleaned-pagination">

          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() =>
              setCurrentPage(
                Math.max(safeCurrentPage - 1, 1)
              )
            }
          >
            ← Previous
          </button>

          <span>
            Page <strong>{safeCurrentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </span>

          <button
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() =>
              setCurrentPage(
                Math.min(
                  safeCurrentPage + 1,
                  totalPages
                )
              )
            }
          >
            Next →
          </button>

        </div>

      </div>

      {/* =====================================================
          CUSTOMER DETAILS
      ===================================================== */}

      {selectedCustomer && (

        <div
          className="cleaned-customer-overlay"
          onClick={() =>
            setSelectedCustomer(null)
          }
        >

          <div
            className="cleaned-customer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="cleaned-customer-modal-header">

              <div>

                <h3>Customer Details</h3>

                <p>
                  {getCustomerName(selectedCustomer)}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                ×
              </button>

            </div>

            <div className="cleaned-customer-details">

              <div>
                <span>ID</span>

                <strong>
                  {getCustomerId(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Name</span>

                <strong>
                  {getCustomerName(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Age</span>

                <strong>
                  {getCustomerAge(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>City</span>

                <strong>
                  {getCustomerCity(selectedCustomer) || "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {getCustomerEmail(selectedCustomer) || "—"}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
/* =========================================================
   API STATUS
========================================================= */

function APIStatusPage({ mysqlConnected, geminiAvailable }) {
  const [apiStatus, setApiStatus] = useState("checking");

  const checkAPI = async () => {
    setApiStatus("checking");

    try {
      const response = await fetch(`${API_URL}/`);

      if (response.ok) {
        setApiStatus("healthy");
      } else {
        setApiStatus("error");
      }
    } catch {
      setApiStatus("error");
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((response) => {
        setApiStatus(response.ok ? "healthy" : "error");
      })
      .catch(() => setApiStatus("error"));
  }, []);

  return (
    <div className="page-container">

      <div className="system-status-grid">

        <StatusCard
          label="API STATUS"
          value={
            apiStatus === "healthy"
              ? "connected"
              : apiStatus === "error"
              ? "offline"
              : "checking"
          }
          icon={Activity}
          status={apiStatus}
        />

        <StatusCard
          label="MYSQL"
          value={mysqlConnected ? "connected" : "not verified"}
          icon={Server}
          status={mysqlConnected ? "healthy" : "unknown"}
        />

        <StatusCard
          label="GEMINI AI"
          value={geminiAvailable ? "available" : "not verified"}
          icon={Sparkles}
          status={geminiAvailable ? "healthy" : "unknown"}
        />

      </div>

      <div className="panel">

        <PanelHeader
          title="Backend Information"
          description="DataMedic AI service configuration"
          icon={Server}
        />

        <div className="info-list">

          <InfoRow
            label="API Base URL"
            value={API_URL}
          />

          <InfoRow
            label="Backend"
            value="FastAPI"
          />

          <InfoRow
            label="Database"
            value="MySQL"
          />

          <InfoRow
            label="AI"
            value="Gemini"
          />

          <InfoRow
            label="Data Processing"
            value="Python + Pandas"
          />

        </div>

        <button
          className="secondary-button"
          onClick={checkAPI}
        >
          <RefreshCw size={15} />
          Check API Again
        </button>

      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        <Icon size={19} />
      </div>

      <div className="stat-content">

        <span className="stat-label">
          {label}
        </span>

        <strong>{value}</strong>

        <p>{description}</p>

      </div>
    </div>
  );
}

function PanelHeader({
  title,
  description,
  icon: Icon,
}) {
  return (
    <div className="panel-header">

      <div>
        <h3>{title}</h3>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {Icon && (
        <div className="panel-header-icon">
          <Icon size={18} />
        </div>
      )}

    </div>
  );
}

function QualityRow({
  label,
  value,
  type,
}) {
  return (
    <div className="quality-row">

      <div className="quality-row-left">

        {type === "success" ? (
          <CheckCircle2 size={18} />
        ) : type === "danger" ? (
          <XCircle size={18} />
        ) : (
          <AlertTriangle size={18} />
        )}

        <span>{label}</span>

      </div>

      <strong className={`quality-value ${type}`}>
        {value}
      </strong>

    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
  variant,
}) {
  return (
    <button
      className={`quick-action quick-action--${variant}`}
      onClick={onClick}
    >
      <div className="quick-action-icon">
        <Icon size={17} />
      </div>

      <div className="quick-action-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <ArrowRight size={16} className="quick-action-arrow" />
    </button>
  );
}

function IssueCard({
  icon: Icon,
  title,
  value,
  description,
  type,
}) {
  return (
    <div className={`issue-card ${type}`}>

      <div className="issue-icon">
        <Icon size={19} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <p>{description}</p>
      </div>

    </div>
  );
}

function AnalysisRow({
  label,
  value,
  status,
  good,
}) {
  return (
    <div className="analysis-row">

      <div>
        <strong>{label}</strong>
        <span>{status}</span>
      </div>

      <div className={good ? "analysis-good" : ""}>
        {value}
      </div>

    </div>
  );
}

function PipelineStep({
  number,
  title,
  description,
  icon: Icon,
  completed,
}) {
  return (
    <div className="pipeline-step">

      <div
        className={`pipeline-number ${
          completed ? "completed" : ""
        }`}
      >
        {completed ? (
          <CheckCircle2 size={20} />
        ) : (
          number
        )}
      </div>

      <div className="pipeline-icon">
        <Icon size={20} />
      </div>

      <div className="pipeline-content">

        <strong>{title}</strong>

        <span>{description}</span>

      </div>

    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        <Icon size={28} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      {buttonText && (
        <button
          className="secondary-button"
          onClick={onClick}
        >
          {buttonText}
          <ArrowRight size={15} className="overview-upload-arrow" />
        </button>
      )}

    </div>
  );
}

function StatusCard({
  label,
  value,
  icon: Icon,
  status,
}) {
  return (
    <div className={`status-card ${status}`}>

      <div className="status-card-icon">
        <Icon size={19} />
      </div>

      <div>
        <span>{label}</span>

        <strong className={`status-${status}`}>
          {value}
        </strong>
      </div>

    </div>
  );
}
function RecordsTable({ rows }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? index}>
              {columns.map((column) => (
                <td key={column}>
                  {row[column] === null ||
                  row[column] === undefined ||
                  row[column] === ""
                    ? "—"
                    : String(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function InfoRow({
  label,
  value,
}) {
  return (
    <div className="info-row">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}

export default App;