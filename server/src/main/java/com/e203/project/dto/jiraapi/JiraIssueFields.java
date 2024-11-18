package com.e203.project.dto.jiraapi;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.e203.project.dto.request.JiraIssueRequestDto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JiraIssueFields {
	JiraIssueRequest fields;

	@Builder
	private JiraIssueFields(JiraIssueRequest fields) {
		this.fields = fields;
	}

	public static JiraIssueFields createEpicJsonObject(JiraIssueRequestDto dto, String jiraProjectId) {
		dto.setSummary(dto.getEpicName());
		dto.setIssueType("Epic");
		
		return transferJsonObject(dto, jiraProjectId);

	}

	public static JiraIssueFields transferJsonObject(JiraIssueRequestDto dto, String jiraProjectId) {
		Map<String, String> content = new HashMap<String, String>();
		content.put("text", dto.getDescription());
		content.put("type", "text");
		IssueContent issueContent = IssueContent.builder()
			.content(List.of(content))
			.build();

		IssueDescription issueDescription = IssueDescription.builder()
			.content(List.of(issueContent))
			.build();

		JiraIssueRequest jiraIssueRequest = new JiraIssueRequest();
		jiraIssueRequest.setProject(new HashMap<>() {{
			put("key", jiraProjectId);
		}});
		jiraIssueRequest.setSummary(dto.getSummary());
		jiraIssueRequest.setStoryPoint(dto.getStoryPoint());
		jiraIssueRequest.setDescription(issueDescription);
		jiraIssueRequest.setEpicKey(dto.getEpicKey());
		jiraIssueRequest.setIssueType(new HashMap<>() {{
			put("name", dto.getIssueType());
		}});
		if (!dto.getAssignee().isBlank()) {
			jiraIssueRequest.setAssignee(new HashMap<>() {{
				put("id", dto.getAssignee());
			}});
		}

		return JiraIssueFields.builder()
			.fields(jiraIssueRequest)
			.build();
	}

}
