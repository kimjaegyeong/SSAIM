package com.e203.project.dto.jiraapi;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.e203.project.dto.request.JiraIssueCreateRequestDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraIssueFields {
	JiraIssueCreate fields;

	@Builder
	private JiraIssueFields(JiraIssueCreate fields) {
		this.fields= fields;
	}

	public static JiraIssueFields transferJsonObject(JiraIssueCreateRequestDto dto, String jiraProjectId) {
		Map<String, String> content = new HashMap<String, String>();
		content.put("text", dto.getDescription());
		content.put("type", "text");
		IssueContent issueContent = IssueContent.builder()
			.content(List.of(content))
			.build();

		IssueDescription issueDescription = IssueDescription.builder()
			.content(List.of(issueContent))
			.build();

		JiraIssueCreate jiraIssueCreate = new JiraIssueCreate();
		jiraIssueCreate.setProject(new HashMap<>(){{
			put("key", jiraProjectId);
		}});
		jiraIssueCreate.setSummary(dto.getSummary());
		jiraIssueCreate.setEpicKey(dto.getEpicKey());
		jiraIssueCreate.setStoryPoint(dto.getStoryPoint());
		jiraIssueCreate.setDescription(issueDescription);
		jiraIssueCreate.setIssueType(new HashMap<>() {{
			put("name", dto.getIssueType());
		}});
		jiraIssueCreate.setAssignee(new HashMap<>() {{
			put("name", dto.getAssignee());
		}});

		return JiraIssueFields.builder()
			.fields(jiraIssueCreate)
			.build();
	}

}
