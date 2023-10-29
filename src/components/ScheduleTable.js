import React from "react";

const ScheduleTable = ({ matches }) => {
  return (
    <div style={{ margin: "100px" }}>
      <h2>Schedule</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Date</th>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>Home Score</th>
            <th>Away Score</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr
              key={index}
              style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
            >
              <td>{new Date(match.date).toLocaleString()}</td>
              <td>{match.homeTeam}</td>
              <td>{match.awayTeam}</td>
              <td>
                {match.homeTeamScore !== null ? match.homeTeamScore : "-"}
              </td>
              <td>
                {match.awayTeamScore !== null ? match.awayTeamScore : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
