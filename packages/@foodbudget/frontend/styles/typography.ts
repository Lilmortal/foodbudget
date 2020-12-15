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

    xxlWeight: string;
    xlWeight: string;
    lgWeight: string;
    mdWeight: string;
    smWeight: string;
    xsWeight: string;
    xxsWeight: string;
}

const typography: Typography = {
  xxsFont: '1.4rem',
  xsFont: '1.8rem',
  smFont: '2rem',
  mdFont: '3.4rem',
  lgFont: '5rem',
  xlFont: '6.5rem',

  mobXxsFont: '1.4rem',
  mobXsFont: '1.6rem',
  mobSmFont: '2rem',
  mobMdFont: '3rem',
  mobLgFont: '3.4rem',
  mobXlFont: '4.5rem',

  xxlWeight: '700',
  xlWeight: '600',
  lgWeight: '550',
  mdWeight: '500',
  smWeight: '450',
  xsWeight: '400',
  xxsWeight: '300',
};

export default typography;
