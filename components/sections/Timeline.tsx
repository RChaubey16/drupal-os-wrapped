import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { UserYearData } from "../../types";
import { fadeInUp } from "../../utils/animations";

interface TimelineProps {
  data: UserYearData;
  themeStyles: any;
  isDark: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ data, themeStyles, isDark }) => {
  const monthMap = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
  };
  const topMonth = data.monthlyStats.reduce(
    (max, curr) => (curr.count > max.count ? curr : max),
    data.monthlyStats[0]
  );
  return (
    <section
      className={`py-20 px-4 md:px-8 ${themeStyles.bg} transition-colors duration-500`}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <h2
            className={`display-font text-3xl md:text-5xl font-bold mb-8 text-center ${themeStyles.text}`}
          >
            Your Year in Flow
          </h2>

          <div
            className={`h-[400px] w-full p-6 rounded-3xl border shadow-lg ${themeStyles.card} ${themeStyles.border}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.monthlyStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  stroke={isDark ? "#a8a29e" : "#64748b"}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{
                    fill: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: isDark ? "#1c1917" : "#fff",
                    color: isDark ? "#f5f5f4" : "#1c1917",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{
                    color: isDark ? "#f5f5f4" : "#1c1917",
                  }}
                  labelStyle={{
                    color: isDark ? "#f5f5f4" : "#1c1917",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                  {data.monthlyStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.count > 15
                          ? isDark
                            ? "#fb923c"
                            : "#0ea5e9"
                          : isDark
                          ? "#44403c"
                          : "#cbd5e1"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className={`text-center mt-6 ${themeStyles.textMuted}`}>
            {monthMap[topMonth.month]} was your busiest month with{" "}
            <span className="font-bold">{topMonth.count} issues</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;
