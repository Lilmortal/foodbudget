import styled from 'styled-components';
import Textfield, { TextfieldProps } from '../Textfield';

export interface AutoCompleteProps extends TextfieldProps {
  name?: string;
}

const AutoCompleteWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

interface SuggestionProps {
  name?: string;
}

const SuggestionList = styled.ul({
  display: 'flex',
  flexDirection: 'column',
});

const SuggestionOption = styled.li({});

const Suggestion: React.FC<SuggestionProps> = () => (
  <SuggestionList>
    <SuggestionOption>test</SuggestionOption>
  </SuggestionList>
);

const AutoComplete: React.FC<AutoCompleteProps> = (props) => (
  <AutoCompleteWrapper>
    <Textfield {...props} />
    <Suggestion />
  </AutoCompleteWrapper>
);

export default AutoComplete;
