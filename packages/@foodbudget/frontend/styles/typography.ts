export interface Typography {
  xxsFont: string;
  xsFont: string;
  smFont: string;
  mdFont: string;
  lgFont: string;
  xlFont: string;

  mobXxsFont: string;
  mobXsFont: string;
  mobSmFont: string;
  mobMdFont: string;
  mobLgFont: string;
  mobXlFont: string;

  xxlWeight: number;
  xlWeight: number;
  lgWeight: number;
  mdWeight: number;
  smWeight: number;
  xsWeight: number;
  xxsWeight: number;
}

const typography: Typography = {
  xxsFont: '1.3rem',
  xsFont: '1.8rem',
  smFont: '2rem',
  mdFont: '3.4rem',
  lgFont: '5rem',
  xlFont: '6.5rem',

  mobXxsFont: '1.3rem',
  mobXsFont: '1.6rem',
  mobSmFont: '2rem',
  mobMdFont: '3rem',
  mobLgFont: '3.4rem',
  mobXlFont: '4.5rem',

  xxlWeight: 700,
  xlWeight: 600,
  lgWeight: 550,
  mdWeight: 500,
  smWeight: 450,
  xsWeight: 400,
  xxsWeight: 300,
};

export default typography;
