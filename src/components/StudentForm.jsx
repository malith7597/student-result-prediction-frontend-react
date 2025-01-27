import React, { useState } from "react";
import {
  Segment,
  Form,
  Dropdown,
  Tab,
  Button,
  Message,
  Table
} from "semantic-ui-react";
import "./StudentForm.css";
import api, { setAuthToken } from "../services/api";

const StudentForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    gender: "",
    studyHours: "",
    extracurricular: "",
    partTimeJob: "",
    struggleWithEnglish: "",
    previousGPA: "",
    Year: "",
    noOf1CreditCourses: 0,
    noOf2CreditCourses: 0,
    noOf3CreditCourses: 0,
    courses: {
      oneCreditCourses: [],
      twoCreditCourses: [],
      threeCreditCourses: []
    }
  });
  const [results, setResults] = useState(null);
  const [response, setResponse] = useState(null);

  const [error, setError] = useState("");

  const yesNoOptions = [
    { key: "yes", text: "Yes", value: 1 },
    { key: "no", text: "No", value: 0 }
  ];

  const genderOptions = [
    { key: "male", text: "Male", value: "Male" },
    { key: "female", text: "Female", value: "Female" }
  ];

  const yearOptions = [
    { key: "first", text: "First", value: "First" },
    { key: "second", text: "Second", value: "Second" },
    { key: "third", text: "Third", value: "Third" }
  ];

  const handleChange = (e, { name, value }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoursesChange = (e, { name, value }) => {
    const updatedData = {
      ...formData,
      [name]: value
    };
    const totalCredits =
      updatedData.noOf1CreditCourses * 1 +
      updatedData.noOf2CreditCourses * 2 +
      updatedData.noOf3CreditCourses * 3;

    if (
      updatedData.noOf1CreditCourses > 4 ||
      updatedData.noOf2CreditCourses > 6 ||
      updatedData.noOf3CreditCourses > 2
    ) {
      setError("Course selection exceeds the allowed limits!");
      return;
    }

    if (totalCredits !== 15) {
      setError("Total credits must be exactly 15.");
    } else {
      setError("");
    }

    setFormData(updatedData);
  };

  const generateCourseFields = (creditType, count) => {
    const fields = [];
    for (let i = 0; i < count; i++) {
      fields.push(
        <Segment key={`${creditType}-${i}`}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>{`Course ${i + 1} Attendance`}</label>
              <Dropdown
                placeholder="Select Yes or No"
                fluid
                selection
                options={yesNoOptions}
                name={`attendance-${creditType}-${i}`}
                onChange={(e, data) =>
                  handleChange(e, {
                    name: `attendance-${creditType}-${i}`,
                    value: data.value
                  })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>{`Course ${i + 1} Assignment Marks`}</label>
              <Form.Input
                placeholder="Enter Marks"
                type="number"
                name={`assignment-${creditType}-${i}`}
                onChange={(e, data) =>
                  handleChange(e, {
                    name: `assignment-${creditType}-${i}`,
                    value: data.value
                  })
                }
                min={0}
                max={35}
              />
            </Form.Field>
          </Form.Group>
        </Segment>
      );
    }

    return fields;
  };

  const validateFormData = () => {
    const { noOf1CreditCourses, noOf2CreditCourses, noOf3CreditCourses } =
      formData;
    const totalCredits =
      noOf1CreditCourses * 1 + noOf2CreditCourses * 2 + noOf3CreditCourses * 3;

    if (totalCredits !== 15) {
      setError("Total credits must be exactly 15.");
      return false;
    }

    if (
      noOf1CreditCourses > 4 ||
      noOf2CreditCourses > 6 ||
      noOf3CreditCourses > 2
    ) {
      setError("You exceeded the maximum number of courses for each type.");
      return false;
    }

    return true;
  };

  // Prepare data in the required format
  const prepareSubmitData = () => {
    const {
      gender,
      studyHours,
      extracurricular,
      partTimeJob,
      struggleWithEnglish,
      previousGPA,
      Year,
      noOf1CreditCourses,
      noOf2CreditCourses,
      noOf3CreditCourses,
      ...rest
    } = formData;

    const submitData = {
      Gender: gender,
      "Study Hours": studyHours,
      Extracurricular_Involvement: extracurricular === 1 ? "Yes" : "No",
      "Part time job": partTimeJob === 1 ? "Yes" : "No",
      "Struggle with English": struggleWithEnglish === 1 ? "Yes" : "No",
      Year: Year, // Placeholder year, update accordingly
      Previous_GPA: previousGPA
    };

    // Helper function to process courses
    const processCourses = (creditType, maxCourses) => {
      // Map numeric creditType to text-based prefixes
      const creditTypePrefix = {
        1: "one_credit_course",
        2: "two_credit_course",
        3: "three_credit_course"
        // Add more as needed
      };

      const prefix =
        creditTypePrefix[creditType] || `${creditType}_credit_course`;

      for (let i = 0; i < maxCourses; i++) {
        const attendanceKey = `attendance-${creditType}-${i}`;
        const assignmentKey = `assignment-${creditType}-${i}`;
        if (
          rest[attendanceKey] !== undefined &&
          rest[assignmentKey] !== undefined
        ) {
          submitData[`${prefix}_${i + 1}_attendance`] = rest[attendanceKey];
          submitData[`${prefix}_${i + 1}_ca`] = rest[assignmentKey];
        }
      }
    };

    processCourses(1, 4);
    processCourses(2, 6);
    processCourses(3, 2);

    return submitData;
  };

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawData = prepareSubmitData();
    console.log("Raw data:", rawData);

    const submitData = [
      {
        Gender: rawData.Gender,
        "Study Hours": Number(rawData["Study Hours"]),
        Extracurricular_Involvement: rawData.Extracurricular_Involvement,
        "Part time job": rawData["Part time job"],
        "Struggle with English": rawData["Struggle with English"],
        Year: rawData.Year,
        Previous_GPA: parseFloat(rawData.Previous_GPA),
        ...Object.fromEntries(
          Object.entries(rawData).filter(([key]) =>
            key.match(/_(ca|attendance)$/)
          )
        )
      }
    ];
    try {
      const response = await api.post("/auth/predict", submitData);

      if (response.data) {
        setResults(response.data);
        setActiveTab(2); // Switch to Results tab
      } else {
        console.error("Form submission failed:", response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const personalInfoPane = (
    <Segment padded raised>
      <Form>
        <Form.Field>
          <label>Gender</label>
          <Dropdown
            placeholder="Select Gender"
            fluid
            selection
            options={genderOptions}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Input
          label="Study Hours"
          placeholder="Enter Study Hours"
          name="studyHours"
          type="number"
          value={formData.studyHours}
          onChange={handleChange}
        />
        <Form.Field>
          <label>Extracurricular Involvement</label>
          <Dropdown
            placeholder="Select Yes or No"
            fluid
            selection
            options={yesNoOptions}
            name="extracurricular"
            value={formData.extracurricular}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Part-Time Job</label>
          <Dropdown
            placeholder="Select Yes or No"
            fluid
            selection
            options={yesNoOptions}
            name="partTimeJob"
            value={formData.partTimeJob}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Struggle with English</label>
          <Dropdown
            placeholder="Select Yes or No"
            fluid
            selection
            options={yesNoOptions}
            name="struggleWithEnglish"
            value={formData.struggleWithEnglish}
            onChange={handleChange}
          />
        </Form.Field>
        <Button color="blue" onClick={() => setActiveTab(1)}>
          Next
        </Button>
      </Form>
    </Segment>
  );

  const academicDetailsPane = (
    <Segment padded raised>
      {error && <Message color="red" content={error} />}
      <Form>
        <Form.Input
          label="Previous GPA"
          placeholder="Enter GPA"
          name="previousGPA"
          type="number"
          value={formData.previousGPA}
          onChange={handleChange}
          min={0}
          max={4}
        />
        <Form.Field>
          <label>Academic Year</label>
          <Dropdown
            label="Year"
            placeholder="Select Year"
            fluid
            selection
            options={yearOptions}
            name="Year"
            value={formData.Year}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Input
          label="Number of 1-Credit Courses (Max 4)"
          placeholder="Enter Count"
          name="noOf1CreditCourses"
          type="number"
          value={formData.noOf1CreditCourses}
          max={4}
          min={0}
          onChange={handleCoursesChange}
        />
        {generateCourseFields(1, formData.noOf1CreditCourses)}

        <Form.Input
          label="Number of 2-Credit Courses (Max 6)"
          placeholder="Enter Count"
          name="noOf2CreditCourses"
          type="number"
          value={formData.noOf2CreditCourses}
          max={6}
          min={0}
          onChange={handleCoursesChange}
        />
        {generateCourseFields(2, formData.noOf2CreditCourses)}

        <Form.Input
          label="Number of 3-Credit Courses (Max 2)"
          placeholder="Enter Count"
          name="noOf3CreditCourses"
          type="number"
          value={formData.noOf3CreditCourses}
          max={2}
          min={0}
          onChange={handleCoursesChange}
        />
        {generateCourseFields(3, formData.noOf3CreditCourses)}

        <Button color="blue" onClick={() => setActiveTab(0)}>
          Previous
        </Button>
        <Button
          color="green"
          type="submit"
          onClick={handleSubmit}
          /* onClick={() => console.log(formData)} */
        >
          Submit
        </Button>
      </Form>
    </Segment>
  );

  const renderResults = () => {
    if (!results || !results.detailed_predictions) {
      return <Message info content="No results available." />;
    }
    const allPass = results.detailed_predictions.every(
      (prediction) => prediction.predicted_class.toLowerCase() === "pass"
    );

    const allFail = results.detailed_predictions.every(
      (prediction) => prediction.predicted_class.toLowerCase() === "fail"
    );

    let finalMessage = "";
    let finalMessageType = "";

    if (allPass) {
      finalMessage = "Congratulations! All predictions indicate a Pass.";
      finalMessageType = "success";
    } else if (allFail) {
      finalMessage =
        "None of the predictions passed. Consider studying more and meeting your lecturers.";
      finalMessageType = "warning";
    } else {
      finalMessage =
        "Mixed predictions. Keep working and consult your lecturers if needed.";
      finalMessageType = "info";
    }

    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Data Point</Table.HeaderCell>
              <Table.HeaderCell>Predicted Class</Table.HeaderCell>
              <Table.HeaderCell>Probability (Fail)</Table.HeaderCell>
              <Table.HeaderCell>Probability (Pass)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {results.detailed_predictions.map((prediction) => (
              <Table.Row key={prediction.data_point}>
                <Table.Cell>{prediction.data_point}</Table.Cell>
                <Table.Cell>{prediction.predicted_class}</Table.Cell>
                <Table.Cell>{prediction.probability_fail}</Table.Cell>
                <Table.Cell>{prediction.probability_pass}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Message
          content={finalMessage}
          color={
            finalMessageType === "success"
              ? "green"
              : finalMessageType === "warning"
              ? "yellow"
              : "blue"
          }
        />
      </div>
    );
  };

  const resultsPane = (
    <Segment padded raised>
      {renderResults()}
    </Segment>
  );

  const panes = [
    { menuItem: "Personal Info", render: () => personalInfoPane },
    { menuItem: "Academic Details", render: () => academicDetailsPane },
    { menuItem: "Results", render: () => resultsPane }
  ];

  return (
    <div className="student-form-container">
      <Tab
        activeIndex={activeTab}
        panes={panes}
        onTabChange={(_, data) => setActiveTab(data.activeIndex)}
        menu={{ secondary: true, pointing: true }}
      />
    </div>
  );
};

export default StudentForm;
