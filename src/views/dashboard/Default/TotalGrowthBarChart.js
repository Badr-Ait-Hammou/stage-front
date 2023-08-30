import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import axios from "utils/axios";

// material-ui
import {useTheme} from '@mui/material/styles';
import {Grid, MenuItem, TextField, Typography} from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import {gridSpacing} from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';

const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({isLoading}) => {
    const [value, setValue] = useState('today');
    const theme = useTheme();
    const [projectCount, setProjectCount] = useState(0); // State to hold the project count
    const customization = useSelector((state) => state.customization);

    const {navType} = customization;
    const {primary} = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [secondaryMain, primaryDark, secondaryMain, secondaryLight],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
        };
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);


    useEffect(() => {
        axios.get('/api/projet/role/CLIENT')
            .then((response) => {
                const data = response.data;
                const projectCounts = new Array(12).fill(0);

                data.forEach((project) => {
                    const creationDate = new Date(project.dateCreation);
                    const monthIndex = creationDate.getMonth();
                    projectCounts[monthIndex]++;
                });

                const totalProjectCount = projectCounts.reduce((sum, count) => sum + count, 0);
                setProjectCount(totalProjectCount);

                const newChartData = {...chartData};

                newChartData.options.xaxis.categories = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];
                newChartData.series[0].data = projectCounts;

                if (!isLoading) {
                    ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
                }
            })
            .catch((error) => {
                console.error('Error fetching project data:', error);
            });
    }, [navType, isLoading]);


    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart/>
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Total Project</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">{projectCount}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
